"use strict";

export const config = {
    name: 'eval',
    role: 2,
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Eval ( stringexpr )',
    enDesc: 'Eval ( stringexpr )',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0,
};

export async function onMessage({ event, api, args }) {
    const { threadID, messageID } = event;
    try {
        const response = await eval(args.join(' '), true);
        return api.sendMessage(response, threadID, messageID);
    } catch (error) {
        return api.sendMessage(error.message || error.stack, threadID, messageID);
    }
}