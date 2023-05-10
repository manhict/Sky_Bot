"use strict";

const config = {
    name: 'xsmb',
    role: 0,
    version: '1.0.0',
    author: ['MạnhG'],
    viDesc: 'KQ XSMB.',
    enDesc: 'KQ XSMB.',
    category: ['Tin tức', 'Social'],
    usages: '',
    timestamp: 5
}

async function onMessage({ message }) {
    let data = await global.social.xsmb();
    message.reply(JSON.parse(JSON.stringify(data)));
}

export {
    config,
    onMessage
}