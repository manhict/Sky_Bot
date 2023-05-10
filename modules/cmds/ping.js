'use strict';
export const config = {
    name: 'ping',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Ping tất cả các thành viên.',
    enDesc: "Ping All member",
    category: ['Nhóm chat', 'Group'],
    usages: '',
    timestamp: 5
};

export async function onMessage({ event, api, args, body }) {
    let botID = api.getCurrentUserID();
    let listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
    let lengthAllUser = listUserID.length;
    let mentions = [];
    var body = args.join(" ") || "@all";
    var lengthbody = body.length;
    let i = 0;
    for (let uid of listUserID) {
        let fromIndex = 0;
        if (lengthbody < lengthAllUser) {
            body += body[lengthbody - 1];
            lengthbody++;
        }
        if (body.slice(0, i).lastIndexOf(body[i]) != -1) fromIndex = i;
        mentions.push({ tag: body[i], id: uid, fromIndex });
        i++;
    }
    return api.sendMessage({ body, mentions }, event.threadID, event.messageID);
}