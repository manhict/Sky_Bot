'use strict';
export const config = {
    name: 'search',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Kết quả tìm kiếm trên google!.',
    enDesc: 'Search results on google!.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 5
}

export async function onMessage({ event, api, args }) {
    let textNeedSearch = "";
    const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
    (event.type == "message_reply") ? textNeedSearch = event.messageReply.attachments[0].url : textNeedSearch = args.join(" ");
    (regex.test(textNeedSearch)) ? api.sendMessage(`https://www.google.com/searchbyimage?&image_url=${textNeedSearch}`, event.threadID, event.messageID) : api.sendMessage(`https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`, event.threadID, event.messageID);
}