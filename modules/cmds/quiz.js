'use strict';
export const config = {
    name: 'quiz',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Trả lời câu hỏi (English).',
    enDesc: 'Answer the question (English).',
    category: ['Game', 'Game'],
    usage: '',
    timestamp: 5
};

import axios from 'axios';
import request from 'request';

export async function onReaction({ api, event, reaction }) {
    if (!event.userID == reaction.author) return;
    let response = "";
    if (event.reaction == "👍") response = "True"
    else response = "False";
    if (response == reaction.answer) api.sendMessage("ye, Bạn đã trả lời chính xác", event.threadID);
    else api.sendMessage("oops, Sai rồi :X", event.threadID);
    const indexOfHandle = client.reaction.findIndex(e => e.messageID == reaction.messageID);
    client.reaction.splice(indexOfHandle, 1);
    reaction.answerYet = 1;
    return client.reaction.push(reaction);
}

export async function onMessage({ api, event, args }) {
    let difficulties = ["easy", "medium", "hard"];
    let difficulty = args[0];
    (difficulties.some(item => difficulty == item)) ? "" : difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    let fetch = await axios(`https://opentdb.com/api.php?amount=1&encode=url3986&type=boolean&difficulty=${difficulty}`);
    if (!fetch.data) return api.sendMessage("Không thể tìm thấy câu hỏi do server bận", event.threadID, event.messageID);
    let decode = decodeURIComponent(fetch.data.results[0].question);
    return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${decode}`), (err, response, body) => {
        if (err) return api.sendMessage("Đã có lỗi xảy ra!", event.threadID, event.messageID);
        var retrieve = JSON.parse(body);
        var text = '';
        retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
        var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
        return api.sendMessage(`Đây là câu hỏi dành cho bạn:\n- ${text}\n\n   👍: True       😢: False`, event.threadID, async(err, info) => {
            client.reaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                answer: fetch.data.results[0].correct_answer,
                answerYet: 0
            });
            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
            const indexOfHandle = client.reaction.findIndex(e => e.messageID == info.messageID);
            let data = client.reaction[indexOfHandle];
            if (data.answerYet !== 1) {
                api.sendMessage(`Time out!! đáp án chính xác là ${fetch.data.results[0].correct_answer}`, event.threadID, info.messageID);
                return client.reaction.splice(indexOfHandle, 1);
            } else return;
        });
    });
}