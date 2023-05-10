'use strict';
export const config = {
    name: 'unsend',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Gỡ tin nhắn của bot.',
    enDesc: "Remove message of bot.",
    category: ['Hệ thống', 'System'],
    usage: '',
    timestamp: 5
};

export const languages = {
	"vi_VN": {
		"returnCant": "〉Không thể gỡ tin nhắn của người khác.",
		"missingReply": "〉Hãy reply tin nhắn cần gỡ."
	},
	"en_US": {
		"returnCant": "〉Can't to unsend message from other user.",
		"missingReply": "〉Reply to the message you want to unsend."
	}
}

export async function onMessage({ api, event, getText }) {
    if(!event.messageID) return;
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
	if (event.type != "message_reply") return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
	return api.unsendMessage(event.messageReply.messageID);
}