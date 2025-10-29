import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Minus, Plus, ShoppingCart, Plus as PlusIcon } from 'lucide-react';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import type { Client } from '../types/client';

interface ClientDetails {
  companyName: string;
  vatNumber: string;
}

export default function ShoppingList() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useShoppingList();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    companyName: '',
    vatNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('company_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            user_id: user.id,
            company_name: clientDetails.companyName,
            vat_number: clientDetails.vatNumber
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setClients([...clients, data]);
      setSelectedClientId(data.id);
      setShowNewClientForm(false);
      setClientDetails({ companyName: '', vatNumber: '' });
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (id: number, newQuantity: number, maxStock: number) => {
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else if (newQuantity <= maxStock) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };

  const handleEmailClick = () => {
    if (!user) {
      // Show sign-in prompt for non-authenticated users
      return;
    }
    setShowEmailForm(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedClient = clients.find(c => c.id === selectedClientId);
    const itemsList = state.items
      .map(item => {
        const name = i18n.language === 'ar' && item.name_ar ? item.name_ar : item.name;
        return `- ${name} (${t('shoppingList.reference')}-${item.reference}) x${item.quantity}`;
      })
      .join('\n');

    const subject = encodeURIComponent('Product Inquiry');
    const body = encodeURIComponent(`Hello,

I would like to inquire about the following products for:

Company Details:
${showNewClientForm ? `
- Company Name: ${clientDetails.companyName}
- VAT Number: ${clientDetails.vatNumber}` : `
- Company Name: ${selectedClient?.company_name}
- VAT Number: ${selectedClient?.vat_number}`}

Products List:
${itemsList}

Please provide me with more information about availability and pricing.

Best regards,
${user?.email}`);

    const mailtoLink = `mailto:luxfood.europe@gmail.com?subject=${subject}&body=${body}`;

    const link = document.createElement('a');
    link.href = mailtoLink;
    link.click();

    setShowEmailForm(false);
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Shopping Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Shopping List Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{t('shoppingList.title')}</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowEmailForm(false);
                  setShowNewClientForm(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{t('shoppingList.empty')}</p>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {i18n.language === 'ar' && item.name_ar ? item.name_ar : item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {t('shoppingList.reference')}-{item.reference}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.stock > 0 
                            ? `${t('shoppingList.inStock')} (${item.stock})`
                            : t('shoppingList.outOfStock')}
                        </p>
                        {item.quantity >= item.stock && (
                          <p className="text-sm text-amber-600">
                            {t('shoppingList.maxStockReached')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                            className="text-gray-500 hover:text-indigo-600"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              {showEmailForm ? (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  {!user && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-yellow-700">
                        Please sign in to send inquiries and manage clients.
                      </p>
                    </div>
                  )}
                  
                  {user && (
                    <>
                      {clients.length > 0 && !showNewClientForm && (
                        <div>
                          <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700">
                            Select Client
                          </label>
                          <select
                            id="clientSelect"
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value="">Select a client...</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>
                                {client.company_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {showNewClientForm && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              id="companyName"
                              value={clientDetails.companyName}
                              onChange={(e) => setClientDetails({...clientDetails, companyName: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                              VAT Number *
                            </label>
                            <input
                              type="text"
                              id="vatNumber"
                              value={clientDetails.vatNumber}
                              onChange={(e) => setClientDetails({...clientDetails, vatNumber: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {!showNewClientForm && (
                        <button
                          type="button"
                          onClick={() => setShowNewClientForm(true)}
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add New Client
                        </button>
                      )}
                    </>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailForm(false);
                        setShowNewClientForm(false);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    {showNewClientForm && user ? (
                      <button
                        type="submit"
                        onClick={handleCreateClient}
                        disabled={isSubmitting}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>{isSubmitting ? 'Saving...' : 'Save Client'}</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!user}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Mail className="h-5 w-5" />
                        <span>Send Inquiry</span>
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex justify-between space-x-4">
                  <button
                    onClick={() => dispatch({ type: 'CLEAR_LIST' })}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                    disabled={state.items.length === 0}
                  >
                    {t('shoppingList.clearList')}
                  </button>
                  <button
                    onClick={handleEmailClick}
                    disabled={state.items.length === 0}
                    className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{t('shoppingList.sendInquiry')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}