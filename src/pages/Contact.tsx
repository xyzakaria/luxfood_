import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto lg:max-w-none">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex items-center">
            <Mail className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-1 text-gray-500">luxfood.europe@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Phone</h3>
              <p className="mt-1 text-gray-500">+33695518305</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              <p className="mt-1 text-gray-500">12 rue du stade 57730 Folschviller</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}