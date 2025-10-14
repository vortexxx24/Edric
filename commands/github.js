const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function githubCommand(sock, chatId, message) {
  try {
    const repoOwner = 'vortexxx24';
    const repoName = 'Edric';
    
    // Fetch real GitHub data
    const [repoData, contributorsData, releasesData] = await Promise.all([
      axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}`),
      axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`),
      axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
    ]);

    const repo = repoData.data;
    const contributors = contributorsData.data;
    const releases = releasesData.data;
    const latestRelease = releases[0]; // Get the latest release

    // Build the message
    let txt = `*乂 EDRIC OS - GITHUB 乂*\n\n`;
    txt += `📁 *Repository:* ${repo.name}\n`;
    txt += `📝 *Description:* ${repo.description || 'Advanced WhatsApp Bot'}\n`;
    txt += `👨‍💻 *Owner:* ${repoOwner}\n`;
    txt += `🌐 *Language:* ${repo.language || 'JavaScript'}\n`;
    txt += `📅 *Created:* ${new Date(repo.created_at).toLocaleDateString()}\n\n`;
    
    // Add release info if available
    if (latestRelease) {
      txt += `*🎯 Latest Release*\n`;
      txt += `🏷️ *Version:* ${latestRelease.tag_name}\n`;
      txt += `📅 *Released:* ${new Date(latestRelease.published_at).toLocaleDateString()}\n`;
      
      // Add release notes (trimmed)
      if (latestRelease.body) {
        const cleanNotes = latestRelease.body
          .replace(/[#*_~`]/g, '') // Remove markdown
          .substring(0, 150)
          .trim();
        if (cleanNotes) {
          txt += `📝 *Notes:* ${cleanNotes}${latestRelease.body.length > 150 ? '...' : ''}\n`;
        }
      }
      txt += `\n`;
    }
    
    txt += `*📊 GitHub Stats*\n`;
    txt += `⭐ Stars: ${repo.stargazers_count}\n`;
    txt += `🍴 Forks: ${repo.forks_count}\n`;
    txt += `👀 Watchers: ${repo.watchers_count}\n`;
    txt += `📦 Open Issues: ${repo.open_issues_count}\n`;
    txt += `📚 Size: ${(repo.size / 1024).toFixed(1)} MB\n`;
    txt += `🔄 Releases: ${releases.length}\n\n`;
    
    txt += `*👥 Contributors:* ${contributors.length}\n`;
    contributors.slice(0, 5).forEach((contributor, index) => {
      txt += `${index + 1}. ${contributor.login} (${contributor.contributions} commits)\n`;
    });
    
    if (contributors.length > 5) {
      txt += `... and ${contributors.length - 5} more\n`;
    }
    
    txt += `\n🔗 *GitHub URL:*\n${repo.html_url}\n\n`;
    txt += `_🚀 Star the repo if you love Edric!_`;

    // Try to send with image if available
    try {
      const imgPath = path.join(__dirname, '../media/Edric.jpg');
      if (fs.existsSync(imgPath)) {
        const imgBuffer = fs.readFileSync(imgPath);
        await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });
      } else {
        await sock.sendMessage(chatId, { text: txt }, { quoted: message });
      }
    } catch (imgError) {
      // Fallback to text only if image fails
      await sock.sendMessage(chatId, { text: txt }, { quoted: message });
    }

  } catch (error) {
    console.error('Error in github command:', error);
    
    // Fallback message if GitHub API fails
    const fallbackTxt = `*乂 EDRIC BOT - GITHUB 乂*\n\n` +
      `📁 *Repository:* Edric\n` +
      `👨‍💻 *Owner:* vortexxx24\n` +
      `🌐 *Language:* JavaScript\n\n` +
      `🔗 *GitHub URL:*\n` +
      `https://github.com/vortexxx24/Edric\n\n` +
      `_🚀 Star the repo if you love Edric!_`;
    
    await sock.sendMessage(chatId, { text: fallbackTxt }, { quoted: message });
  }
}

module.exports = githubCommand;