'use strict';

import moment from 'moment-timezone';
import axios from 'axios';
import fs from 'fs';

export const config = {
    name: 'github',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Get thông tin username github.',
    enDesc: 'Information of Github username.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 5
}

var pathImg = process.cwd() + '/caches/' + Date.now() + '_github.png';
export async function onMessage({ api, event, args }) {
    if (!args[0]) return api.sendMessage(`Github username cannot be empty!`, event.threadID, event.messageID);
    axios.get(`https://api.github.com/users/${encodeURI(args.join(" "))}`)
        .then(({ data }) => {
            if (!data || data.error) return api.sendMessage(`User Not Found | Please Give Me A Valid Username!`, event.threadID, event.messageID);
            let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = data;
            const info =
                `» ${login} Information!\n\nUsername: ${login}\nID: ${id}\nUrl: github.com/${login}\nBio: ${bio || "No Bio"}\nPublic Repositories: ${public_repos || "None"}\nFollowers: ${followers}\nFollowing: ${following}\nLocation: ${location || "No Location"}\nAccount Created: ${moment.utc(created_at).format("dddd, MMMM, Do YYYY")}`;

            axios.get(`${avatar_url}`, { responseType: "arraybuffer" })
                .then(({ data }) => {
                    fs.writeFileSync(pathImg, Buffer.from(data, "utf-8"));
                });

            api.sendMessage({
                attachment: fs.createReadStream(pathImg),
                body: info
            }, event.threadID, event.messageID);
            return fs.unlinkSync(pathImg);
        })
        .catch(error => api.sendMessage(error.message, event.threadID, event.messageID));
};