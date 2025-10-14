/**
 * 🚨 IMPORTANT SETUP INSTRUCTIONS 🚨
 * 
 * BEFORE STARTING THE BOT, REPLACE THESE 2 NUMBERS WITH YOURS:
 * 
 * 1. ownerNumber: '234YOURNUMBER@s.whatsapp.net'
 * 2. antideleteNumber: '234YOURNUMBER@s.whatsapp.net'
 * 
 * 📝 FORMAT: '2348123456789@s.whatsapp.net'
 * 
 * ⚠️  Keep the @s.whatsapp.net part
 * ⚠️  Use your actual WhatsApp number with country code
 * ⚠️  No spaces, no plus sign
 * 
 * Example for Nigeria: '2348123456789@s.whatsapp.net'
 */

const settings = {
  // ==================== ⚠️ REPLACE THESE 2 LINES WITH YOUR NUMBER ⚠️ ====================
  ownerNumber: '2348109900388@s.whatsapp.net', // 🔄 REPLACE THIS WITH YOUR NUMBER
  antideleteNumber: '2348109900388@s.whatsapp.net', // 🔄 REPLACE THIS WITH YOUR NUMBER
  
  // ==================== BOT IDENTITY ====================
  packname: 'Edric',                          // Sticker pack name
  author: 'Vortexx',                          // Sticker author
  botName: "Edric",                           // Bot display name
  botOwner: 'Vortexx',                        // Owner name
  ownerName: 'Vortexx 😈',                    // For .about command
  version: '1.0.0',                           // Bot version
  
  // ==================== PAYMENT & SUPPORT ====================
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

  // ==================== EXTERNAL INTEGRATIONS ====================
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq', // Giphy API key

  // ==================== BOT BEHAVIOR ====================
  commandMode: "public",                      // Command mode
  maxStoreMessages: 20,                       // Max messages stored
  storeWriteInterval: 10000,                  // Save interval in ms

  // ==================== CHATBOT SETTINGS ====================
  chatbotMood: 'funny',                       // Default mood
  chatbotActive: true,                        // Bot starts active

  // ==================== META & UPDATES ====================
  description: "This is Edric, your WhatsApp assistant bot.",
  updateZipUrl: "https://github.com/vortexxx24/Edric/archive/refs/heads/main.zip",                           // Optional update URL
  
  // ==================== GITHUB INFORMATION ====================
  github: {
    repo: "vortexxx24/Edric",
    url: "https://github.com/vortexxx24/Edric",
    owner: "vortexxx24"
  },
  
  // ==================== FEATURE TOGGLES ====================
  features: {
    ai: true,
    games: true,
    downloads: true,
    moderation: true,
    updates: true,
    stickers: true,
    chatbot: true
  }
};

module.exports = settings;