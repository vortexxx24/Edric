const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    // Fake GitHub stats
    const stars = 890;
    const forks = 672;
    const watchers = 175;
    const issues = 5;

    // Build the message text
    let txt = `*乂  Edric Bot 乂*\n\n`;
    txt += `✩ *Bot Name:* Edric\n`;
    txt += `✩ *Version:* 1.0.0\n`;
    txt += `✩ *Author:* Your Name\n`;
    txt += `✩ *Commands:* 40+ commands\n\n`;
    txt += `*📊 GitHub Stats (Placeholder)*\n`;
    txt += `⭐ Stars: ${stars}\n`;
    txt += `🍴 Forks: ${forks}\n`;
    txt += `👀 Watchers: ${watchers}\n`;
    txt += `🐞 Open Issues: ${issues}\n\n`;
    txt += `💻 GitHub repository coming soon 😁♻️😌!`;

    // Use the local asset image
    const imgPath = path.join(__dirname, '../assets/bot_image.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    // Send the image with caption
    await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });

  } catch (error) {
    console.error('Error in github command:', error);
    await sock.sendMessage(chatId, { text: '❌ Failed to fetch bot information.' }, { quoted: message });
  }
}

module.exports = githubCommand;