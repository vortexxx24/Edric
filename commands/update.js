const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) return reject(new Error((stderr || stdout || err.message || '').toString()));
            resolve((stdout || '').toString());
        });
    });
}

async function hasGitRepo() {
    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) return false;
    try {
        await run('git --version');
        return true;
    } catch {
        return false;
    }
}

async function getGitChanges() {
    try {
        const oldRev = (await run('git rev-parse HEAD')).trim();
        await run('git fetch origin');
        const newRev = (await run('git rev-parse origin/main')).trim();
        
        if (oldRev === newRev) {
            return { updated: false, oldRev, newRev };
        }

        const commits = await run(`git log --oneline --pretty=format:"%h %s" ${oldRev}..${newRev}`);
        const files = await run(`git diff --name-only ${oldRev} ${newRev}`);
        
        return { 
            updated: true, 
            oldRev: oldRev.substring(0, 7), 
            newRev: newRev.substring(0, 7),
            commits: commits.split('\n').filter(c => c.trim()),
            files: files.split('\n').filter(f => f.trim())
        };
    } catch (error) {
        throw new Error('Git operations failed: ' + error.message);
    }
}

async function performGitUpdate() {
    await run('git fetch origin');
    await run('git reset --hard origin/main');
    await run('git clean -fd');
    await run('npm install --no-audit --no-fund');
}

async function getGitHubUpdates() {
    try {
        const repoResponse = await axios.get('https://api.github.com/repos/vortexxx24/Edric/releases/latest');
        const latestRelease = repoResponse.data;
        const currentVersion = require('../settings').version || '1.0.0';
        
        if (latestRelease.tag_name === currentVersion) {
            return { updated: false, currentVersion, latestVersion: latestRelease.tag_name };
        }

        // Get commit history from GitHub API
        const commitsResponse = await axios.get('https://api.github.com/repos/vortexxx24/Edric/commits');
        const recentCommits = commitsResponse.data.slice(0, 5).map(commit => ({
            hash: commit.sha.substring(0, 7),
            message: commit.commit.message.split('\n')[0]
        }));

        return {
            updated: true,
            currentVersion,
            latestVersion: latestRelease.tag_name,
            releaseNotes: latestRelease.body || 'Bug fixes and improvements',
            commits: recentCommits,
            downloadUrl: latestRelease.zipball_url,
            htmlUrl: latestRelease.html_url
        };
    } catch (error) {
        throw new Error('GitHub API failed: ' + error.message);
    }
}

async function updateCommand(sock, chatId, message, senderIsSudo) {
    if (!message.key.fromMe && !senderIsSudo) {
        await sock.sendMessage(chatId, { text: '❌ Only bot owner or sudo can use .update' }, { quoted: message });
        return;
    }

    try {
        // Initial message with cool animation
        const statusMsg = await sock.sendMessage(chatId, { text: '🔄 Edric is checking for updates…' });
        const editMsg = statusMsg.key;

        const totalSteps = 20;
        const emptyChar = '░';
        const barEmojis = ['⚡', '🔥', '💥', '🌟', '💎'];
        const spinnerEmojis = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

        // Spinner animation
        const animateSpinner = async (durationMs, text) => {
            const start = Date.now();
            let i = 0;
            while (Date.now() - start < durationMs) {
                const spinner = spinnerEmojis[i % spinnerEmojis.length];
                await sock.sendMessage(chatId, { text: `${spinner} ${text}`, edit: editMsg });
                await new Promise(r => setTimeout(r, 150));
                i++;
            }
        };

        // Progress bar animation
        const animateProgress = async (stage, liveData = []) => {
            for (let i = 0; i <= totalSteps; i++) {
                const emoji = barEmojis[Math.floor(Math.random() * barEmojis.length)];
                const filled = emoji.repeat(i);
                const empty = emptyChar.repeat(totalSteps - i);
                const percentage = Math.floor((i / totalSteps) * 100);

                let liveText = '';
                if (liveData.length > 0) {
                    const randomItems = liveData.sort(() => 0.5 - Math.random()).slice(0, 2);
                    liveText = `\n📝 ${randomItems.join('\n')}`;
                }

                const text = `${stage} [${filled}${empty}] ${percentage}%${liveText}`;
                await sock.sendMessage(chatId, { text, edit: editMsg });
                await new Promise(r => setTimeout(r, 200));
            }
        };

        // Step 1: Check for updates with spinner
        await animateSpinner(2000, 'Checking GitHub for updates…');

        let updateInfo;
        let usingGit = false;

        // Check if Git is available
        if (await hasGitRepo()) {
            usingGit = true;
            updateInfo = await getGitChanges();
            
            if (!updateInfo.updated) {
                await sock.sendMessage(chatId, { 
                    text: '✅ Already up to date!\n🎯 Running latest version from GitHub.' 
                }, { quoted: message });
                return;
            }

            // Show what's being updated
            const updatePreview = `📥 *Update Available!*\n\n` +
                `🔀 *Commits:* ${updateInfo.commits.length}\n` +
                `📁 *Files:* ${updateInfo.files.length}\n\n` +
                `_Starting update process..._`;
            
            await sock.sendMessage(chatId, { text: updatePreview }, { quoted: message });
            await new Promise(r => setTimeout(r, 1500));

            // Step 2: Download updates with progress bar
            await animateProgress('📥 Downloading updates', updateInfo.commits.slice(0, 3));

            // Step 3: Install files with progress bar  
            await animateProgress('⚙️ Installing files', updateInfo.files.slice(0, 3));

            // Step 4: Actually perform the update (silent - no animation)
            await sock.sendMessage(chatId, { text: '🔧 Applying updates…', edit: editMsg });
            await performGitUpdate();

            // Step 5: Final configuration
            await animateProgress('🎯 Finalizing update', ['Optimizing performance', 'Updating dependencies']);

            // Success message with update details
            const successMessage = `🎉 *Update Complete!*\n\n` +
                `🔄 *From:* ${updateInfo.oldRev} → ${updateInfo.newRev}\n` +
                `📝 *Commits Applied:* ${updateInfo.commits.length}\n` +
                `📁 *Files Updated:* ${updateInfo.files.length}\n\n` +
                `🚀 *Restarting Edric...*\n` +
                `_Type .ping to verify new version_`;

            await sock.sendMessage(chatId, { text: successMessage }, { quoted: message });

            // Auto-restart after delay
            setTimeout(() => {
                process.exit(0); // Panel will auto-restart
            }, 3000);

        } else {
            // Use GitHub API fallback for hosting panels
            updateInfo = await getGitHubUpdates();
            
            if (!updateInfo.updated) {
                await sock.sendMessage(chatId, { 
                    text: `✅ Already up to date!\n🎯 Version: ${updateInfo.currentVersion}` 
                }, { quoted: message });
                return;
            }

            // Show GitHub update info with animations
            await animateProgress('📥 Update Available', [
                `New: ${updateInfo.latestVersion}`,
                `Current: ${updateInfo.currentVersion}`
            ]);

            await animateProgress('📋 Checking changes', [
                ...updateInfo.commits.slice(0, 2).map(c => `${c.hash} ${c.message}`)
            ]);

            // Provide manual update instructions
            const updateInstructions = `🎉 *Update Available!*\n\n` +
                `🔄 *${updateInfo.currentVersion} → ${updateInfo.latestVersion}*\n\n` +
                `📥 *How to Update:*\n` +
                `1. Download: ${updateInfo.htmlUrl}\n` +
                `2. Upload to your hosting panel\n` +
                `3. Run: npm install\n` +
                `4. Restart the bot\n\n` +
                `📝 *What's New:*\n` +
                `${updateInfo.releaseNotes.substring(0, 150)}...\n\n` +
                `💡 *For auto-updates, use Git clone method*`;

            await sock.sendMessage(chatId, { text: updateInstructions }, { quoted: message });
        }

    } catch (error) {
        console.error('Update failed:', error);
        
        let errorMessage;
        
        if (error.message.includes('Git operations failed') || error.message.includes('GitHub API failed')) {
            errorMessage = `❌ *Update Check Failed!*\n\n` +
                `💡 *Error:* ${error.message}\n\n` +
                `📥 *Manual Update:*\n` +
                `https://github.com/vortexxx24/Edric\n\n` +
                `🔧 *Steps:*\n` +
                `1. Download latest files\n` +
                `2. Upload to your panel\n` +
                `3. Run: npm install\n` +
                `4. Restart bot`;
        } else {
            errorMessage = `❌ *Update Failed!*\n\n` +
                `💡 *Error:* ${error.message}\n\n` +
                `🔧 *Troubleshooting:*\n` +
                `• Check internet connection\n` +
                `• Verify repository access\n` +
                `• Try manual update from GitHub`;
        }

        await sock.sendMessage(chatId, { text: errorMessage }, { quoted: message });
    }
}

module.exports = updateCommand;