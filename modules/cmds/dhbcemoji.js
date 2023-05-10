'use strict';
export const config = {
    name: 'dhbcemoji',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Đuổi hình bắt chữ trên chính messenger của bạn.',
    enDesc: 'Play emoji game.',
    category: ['Game', 'Game'],
    usage: '',
    timestamp: 5
}

export async function onReply({ args, event, api, reply }) {
    var { wordcomplete } = reply;
    if (event.senderID != reply.author) return
    switch (reply.type) {
        case "reply":
            {
                function formatText(text) {
                    return text.normalize("NFD")
                        .toLowerCase()
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/đ/g, "d")
                        .replace(/Đ/g, "D");
                }
                (formatText(event.body) == formatText(wordcomplete)) ? api.sendMessage(`✔ Chính xác!\nĐáp án: ${wordcomplete}`, event.threadID, event.messageID) : api.sendMessage(`✘ Sai rồi nha, bạn óc c.hó zậy... zD`, event.threadID, event.messageID)
            }
    }
}

export async function onMessage({ api, event }) {
    const random = await api.gameDhbcEmoji();
    return api.sendMessage(`Hãy reply tin nhắn này với câu trả lời\n${random.emoji1}${random.emoji2}\n${random.wordcomplete.replace(/\S/g, "█ ")}`, event.threadID, (error, info) => {
        client.reply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            wordcomplete: random.wordcomplete
        })
    })
};