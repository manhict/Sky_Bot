'use strict';
export const config = {
    name: 'dovui',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Game đố vui.',
    enDesc: 'Game đố vui.',
    category: ['Game', 'Game'],
    usage: '',
    timestamp: 5
};

const timeout = 120;
export async function onReply({ args, event, Users, api, reply }) {
    var { dataGame, dapan, nameUser } = reply;
    if (reply.author != event.senderID) return;
    switch (reply.type) {
        case "reply":
            {
                const aw = event.body
                const dapanUser = dataGame
                const checkTrue = dapan
                if (aw.toLowerCase() == 'a' && dataGame.a == checkTrue) {
                    api.unsendMessage(reply.messageID)
                    var msg = { body: `✔${nameUser} đã trả lời chính xác!\nĐáp án: A\n${checkTrue}` }
                    return api.sendMessage(msg, event.threadID, event.messageID)
                } else
                if (aw.toLowerCase() == 'b' && dataGame.b == checkTrue) {
                    api.unsendMessage(reply.messageID)
                    var msg = { body: `✔${nameUser} đã trả lời chính xác!\nĐáp án: B\n${checkTrue}` }
                    return api.sendMessage(msg, event.threadID, event.messageID)
                } else
                if (aw.toLowerCase() == 'c' && dataGame.c == checkTrue) {
                    api.unsendMessage(reply.messageID)
                    var msg = { body: `✔${nameUser} đã trả lời chính xác!\nĐáp án: C\n${checkTrue}` }
                    return api.sendMessage(msg, event.threadID, event.messageID)
                } else
                if (aw.toLowerCase() == 'd' && dataGame.d == checkTrue) {
                    api.unsendMessage(reply.messageID)
                    var msg = { body: `✔${nameUser} đã trả lời chính xác!\nĐáp án: D\n${checkTrue}` }
                    return api.sendMessage(msg, event.threadID, event.messageID)
                } else {
                    api.unsendMessage(reply.messageID)
                    api.sendMessage(`✘Tiếc quá! ${nameUser} trả lời sai rồi!!!\nĐáp án chính xác là: ${dapan}`, event.threadID);
                }
            }
    }
}
export async function onReaction({ Users, api, event, reaction, }){
    var { dataGame, dapan, author, nameUser } = reaction;
    //if (parseInt(event.userID) !== parseInt(reaction.author)) return;

    if (event.userID != author) return;
    if (event.reaction != "👍" && event.reaction != "😆" && event.reaction != "😮" && event.reaction != "😢") return;
    let response = "";
    if (event.reaction == "👍") response = dataGame.a
    else if (event.reaction == "😢") response = dataGame.b
    else if (event.reaction == "😆") response = dataGame.c
    else if (event.reaction == "😮") response = dataGame.d

    if (response == reaction.dapan) {
        api.unsendMessage(reaction.messageID)
        api.sendMessage(`✔Hay quá! ${nameUser} trả lời đúng rồi.\nĐáp án: ${dapan}`, event.threadID)
    } else {
        api.unsendMessage(reaction.messageID)
        api.sendMessage(`✘Tiếc quá! ${nameUser} trả lời sai rồi!!!\nĐáp án chính xác là: ${dapan}`, event.threadID);
    }
}

export async function onMessage({ api, event, Users }) {
    const dataGame = await api.gameDovuiV1();
    var namePlayer_react = await Users.getData(event.senderID)
    var msg = { body: `❔Câu hỏi dành cho bạn: ${dataGame.questions}\n\n👍/A. ${dataGame.a}\n😢/B. ${dataGame.b}\n😆/C. ${dataGame.c}\n😮/D. ${dataGame.d}\n\n🌻Reply tin nhắn hoặc thả cảm xúc để trả lời` }
    return api.sendMessage(msg, event.threadID, (error, info) => {
        client.reaction.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: dataGame,
            dapan: dataGame.dapan,
            nameUser: namePlayer_react.name
        })
        client.reply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: dataGame,
            dapan: dataGame.dapan,
            nameUser: namePlayer_react.name
        })
        setTimeout(function() {
            api.unsendMessage(info.messageID)
        }, timeout * 1000);
    })
}