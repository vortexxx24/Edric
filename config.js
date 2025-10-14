require('dotenv').config();
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const settings = require('./settings.js');

// ==== Validation ====
if (!settings.ownerNumber) {
    console.error(chalk.red('❌ ERROR: ownerNumber not set in settings.js!'));
    console.log(chalk.yellow('💡 Edit settings.js and add your WhatsApp number'));
    process.exit(1);
}

// ==== API Endpoints ====
global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net',
    deepai: 'https://api.deepai.org',
    openai: 'https://api.openai.com/v1'
};

// ==== API Keys ====
global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux',
    'https://api.deepai.org': process.env.DEEPAI_KEY || 'your-deepai-key',
    'https://api.openai.com/v1': process.env.OPENAI_KEY || 'your-openai-key'
};

// ==== Environment Variables ====
global.ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    DEEPAI_KEY: process.env.DEEPAI_KEY,
    OPENAI_KEY: process.env.OPENAI_KEY,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// ==== Bot Identity ====
global.BOT_NAME = settings.botName;
global.OWNER_NAME = settings.botOwner;
global.OWNER_JID = `${settings.ownerNumber}@s.whatsapp.net`;

// ==== Antidelete Settings ====
global.ANTIDELETE_DM = settings.antideleteNumber ? `${settings.antideleteNumber}@s.whatsapp.net` : null;

// ==== Bot Settings ====
global.PUBLIC_MODE = settings.commandMode === 'public';
global.LOG_DELETED_MESSAGES = true;
global.TEMP_MEDIA_LIMIT_MB = settings.maxStoreMessages || 100;
global.START_TIME = Date.now();

// ==== Feature Flags ====
global.FEATURES = {
    voiceCaption: true,
    autoModeration: false,
    animeMode: true,
    aiChat: !!process.env.OPENAI_KEY,
    imageGeneration: !!process.env.DEEPAI_KEY,
    voiceCommands: false,
    pluginSystem: true,
    updates: settings.features?.updates || true,
    games: settings.features?.games || true
};

// ==== Command Behavior ====
global.WARN_COUNT = settings.maxWarnings || 3;
global.COMMAND_COOLDOWN = settings.commandCooldown || 5;

// ==== Elegant Console Output ====
console.log(chalk.green('\n✅ Edric Config Loaded Successfully'));
console.log(chalk.blue(`
╔════════════════════════════════════╗
║ 🚀Edric is online and operational😈║
╚════════════════════════════════════╝
`));
console.log(chalk.yellow(`🕒 Startup Time: ${new Date().toLocaleString()}`));
console.log(chalk.cyan(`🧬 Bot Version: ${settings.version}`));
console.log(chalk.magenta(`🛡️ Command Mode: ${settings.commandMode.toUpperCase()}`));
console.log(chalk.green(`🤖 AI Features: ${global.FEATURES.aiChat ? 'ENABLED' : 'DISABLED'}`));
console.log(chalk.cyan('💬 Tip: Stay curious, code fearless.'));

const moods = ['😎', '🤖', '🧠', '🔥', '✨', '🛠️', '🎯'];
console.log(`Mood: ${moods[Math.floor(Math.random() * moods.length)]}`);

const env = process.env.NODE_ENV || 'development';
console.log(`🌍 Environment: ${env.toUpperCase()}`);
console.log('🔧 Powered by Edric OS Engine v1.0.0');

// Optional rainbow animation
if (env === 'development') {
    const rainbow = chalkAnimation.rainbow('🌈 Edric is alive and glowing 😎!');
    setTimeout(() => {
        rainbow.stop();
    }, 3000);
}

// ==== Export Config ====
module.exports = {
    WARN_COUNT: global.WARN_COUNT,
    APIs: global.APIs,
    APIKeys: global.APIKeys,
    FEATURES: global.FEATURES,
    ENV: global.ENV
};