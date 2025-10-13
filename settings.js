const settings = {
  packname: 'Edric',                          // Sticker pack name
  author: 'Vortexx',                          // Sticker author
  botName: "Edric",                           // Bot display name
  botOwner: 'Vortexx',                        // Owner name
  ownerNumber: '2348109900388@s.whatsapp.net', // Replace the number there with yours

  // NEW SETTINGS ADDED ↓
  ownerName: 'Vortexx 😈',                       // For .about command
  version: '1.0',                             // Updated version for .about
  
  // Payment and Support Details
  supportDetails: '• PayPal: rickfred470@gmail.com\n• OPay: 7037383885 (Fredrick)\n• Contact for other methods',
  donationDetails: '• PayPal: rickfred470@gmail.com\n• OPay: 7037383885 (Fredrick)\n• Crypto: Contact for addresses',
  
  // Contact Information
  contact: {
    email: 'vortex222444@gmail.com',
    telegram: 'https://t.me/VOrteXxX24',
    paypal: 'rickfred470@gmail.com',
    opay: {
      number: '7037383885',
      name: 'Fredrick'
    }
  },

  // Antidelete feature
  antideleteNumber: '2348109900388@s.whatsapp.net', // Replace the above number with yours

  // External integrations
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq', // Giphy API key

  // Bot behavior
  commandMode: "public",                      // Command mode
  maxStoreMessages: 20,                       // Max messages stored
  storeWriteInterval: 10000,                  // Save interval in ms

  // Chatbot personality
  chatbotMood: 'funny',                       // Default mood
  chatbotActive: true,                        // Bot starts active

  // Meta
  description: "This is Edric, your WhatsApp assistant bot.",
  updateZipUrl: ""                            // Optional update URL
};

module.exports = settings;