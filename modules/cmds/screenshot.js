'use strict';
export const config = {
    name: 'screenshot',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Chụp ảnh 1 trang web nào đó.',
    enDesc: 'Screenshot a website.',
    category: ['Tiện ích', 'Utility'],
    usages: '',
    timestamp: 5
};

import axios from 'axios';
import { writeFileSync, existsSync, createReadStream, unlinkSync } from 'fs';

var pathPNG = process.cwd() + '/caches/' + Date.now() + '_screenshot.png';

export async function onMessage({ event, api, args }) {
    let photoURL = `https://shot.screenshotapi.net/screenshot?token=BGHH312-KDS44HT-QD8N287-DNSHKFV&url=${args[0]}&output=image&file_type=png&wait_for_event=load&delay=1000`;
    try {
        await global.utils.downloadFileHttps(photoURL, pathPNG);
        return api.sendMessage({ attachment: createReadStream(pathPNG) }, event.threadID, () => unlinkSync(pathPNG));
    } catch (error) {
        return api.sendMessage(error.message, event.threadID);
    }
}