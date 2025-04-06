// config.js
export const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      price: 49.99,
      image: "https://store.aliconnects.com/earbuds.jpg",
      url: "https://store.aliconnects.com/product/earbuds",
      description: "Wireless Bluetooth earbuds with charging case, IPX7 waterproof.",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 89.99,
      image: "https://store.aliconnects.com/watch.jpg",
      url: "https://store.aliconnects.com/product/watch",
      description: "Smartwatch with heart rate monitoring, IP68 waterproof.",
    },
  ];
  
  export const storeInfo = {
    name: "AliConnects",
    website: "https://store.aliconnects.com/",
    shipping: "Free shipping on orders over $50.",
    returns: "30-day return policy.",
  };
  
  export const systemPrompt = `
  You are Alixia, the shopping assistant for AliConnects. Follow these rules:
  1. ONLY recommend products from the provided list. Never make up products.
  2. Always include: 
     - Product image: ![alt](image_url)
     - Link: [Buy here](product_url)
     - Price: $XX.XX
  3. Be friendly and concise.
  
  Products: ${JSON.stringify(products)}
  `;