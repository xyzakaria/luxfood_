export async function loadProductsFromCSV(): Promise<any[]> {
  try {
    const response = await fetch('/src/data/products.csv');
    const csvText = await response.text();
    
    // Skip header row and parse CSV
    const rows = csvText.split('\n').slice(1);
    return rows.map(row => {
      const [id, category, image, price, name] = row.split(',');
      return {
        id: parseInt(id),
        category,
        image,
        price: parseFloat(price),
        name
      };
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}