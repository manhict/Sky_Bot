'use strict';
export const config = {
    name: 'sing',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm.',
    enDesc: 'Play music through YouTube link or search keyword.',
    category: ['Giải trí', 'Media'],
    usages: '',
    timestamp: 5
};
var rdPath = `sing_` + Math.floor(Math.random() * 99999999);
import { statSync, createReadStream, unlinkSync } from 'fs'

export async function checkSend(linkurl, api, event) {
    const { threadID, messageID } = event;
    try {
        api.sendMessage(`Loading, please wait...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 10000));
       const data =await api.youtubeDL(linkurl);
        if (data.error) return api.sendMessage(data.error, threadID);
        let title = data.title;
        let link = data.link.SD;
        var path = client.dirMain + `/caches/${rdPath}.mp3`;
        if (link == undefined || link == "") {
            const data = await api.youtubeDL(linkurl);
            if (data.error) return api.sendMessage(data.error, threadID);
            let titlev2 = data.title;
            let linkv2 = data.link.audio;
            await global.utils.downloadFile(linkv2, path)
            await api.sendMessage({ body: titlev2, attachment: createReadStream(path) }, threadID, messageID);
            return await unlinkSync(path)
        } else {
            await global.utils.downloadFile(link, path)
            if (await statSync(path).size > 26000000) {
                unlinkSync(path)
                api.sendMessage(`File > 25Mb -> Render...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 10000));
                const data = await api.youtubeDL(linkurl);
                if (data.error) return api.sendMessage(data.error, threadID);
                let title3 = data.title;
                let link3 = data.link.audio;
                var rdPath2 = `singMax_` + Math.floor(Math.random() * 99999999);
                var path2 = client.dirMain + `/caches/${rdPath2}.mp3`;
                await global.utils.downloadFile(link3, path2)
                await api.sendMessage({ body: title3, attachment: createReadStream(path2) }, threadID, messageID);
                return await unlinkSync(path2)
            } else {
                await api.sendMessage({ body: title, attachment: createReadStream(path) }, threadID, messageID);
                return await unlinkSync(path)
            } 
        }
    } catch (e) {
        console.log(e.message);
        return api.sendMessage(e.message, threadID, messageID);
    }
}

export async function onMessage({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    if (args.join(" ").indexOf("https://") == 0) {
        const linkurl = (args.join(" ")).trim();
        await checkSend(linkurl, api, event);
    } else if (args.join(" ") == "") {
        return api.sendMessage("Reply tin nhắn này nhập thời gian tìm kiếm YTB(Là 1 con số 3 < timeSearch < 9)\n\nVí dụ:\n4 -> get những bài nhạc ngắn\n7 -> get những bài nhạc siêu dài", threadID, (err, info) => {
            global.client.reply.push({
                step: 1,
                name: this.config.name,
                messageID: info.messageID,
                content: {
                    id: senderID,
                    timeSearch: "",
                    keySearch: ""
                }
            })
        }, messageID);
    } else {
        let results = [],
            link = [],
            msg = "",
            num = 0,
            value;
        const keywordSearch = args.join(" ");
        const data = await api.youtubeSearch(keywordSearch);
        results = data.results;
        for (let i = 0; i < 6; i++) {
            if (results[i].video != undefined) {
                if (results[i].video.duration.length <= 4 && results[i].video.duration != "Live") {
                    num = num += 1;
                    var title = results[i].video.title;
                    var url = results[i].video.url;
                    var time = results[i].video.duration;
                    var views = results[i].video.views;
                    link.push(url);
                    msg += `${num}.《${time}》 ${title}\n☞ Views: ${views}\n\n`;
                }
            }
        }
        var bodySend = `»🔎 There are ${link.length} results matching your search keyword:\n\n${msg}» Please reply (feedback) choose one of the above searches.`;
        api.sendMessage({
                body: bodySend
            }, threadID, (error, info) => {
                global.client.reply.push({
                    step: "reply_bodySend",
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    idYT: link
                })
            },
            messageID);
        return;
    }
}

export async function onReply({ event, api, args, reply }) {
    const { threadID, senderID, messageID, body } = event;

    function number1(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 4 || x > 8);
    }

    function number(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 1 || x > 20);
    }

    const input = body.trim();
    const sendC = (msg, step, content) => api.sendMessage(msg, threadID, (err, info) => {
        global.client.reply.splice(global.client.reply.indexOf(reply), 1);
        api.unsendMessage(reply.messageID);
        global.client.reply.push({
            step: step,
            name: this.config.name,
            messageID: info.messageID,
            content: content
        })
    }, messageID);

    let content = reply.content;
    switch (reply.step) {
        case 1:
            content.timeSearch = input;
            if (number1(body)) return api.sendMessage('Chọn từ 4 -> 8, baby. love uwu ❤️', threadID, messageID);
            sendC("Reply tin nhắn này nhập từ cần tìm kiếm hoặc url video", 2, content);
            break;

        case 2:
            content.keySearch = input;
            global.client.reply.splice(global.client.reply.indexOf(reply), 1);
            api.unsendMessage(reply.messageID);
            let c = content;
            if (c.keySearch.indexOf("https://") == 0) {
                const linkurl = (c.keySearch);
                await checkSend(linkurl, api, event);
            } else {
                let results = [],
                    link = [],
                    msg = "",
                    num = 0,
                    value;
                const keywordSearch = args.join(" ");
                const data = await api.youtubeSearch(keywordSearch);
                results = data.results;
                for (let key in results) {
                    if (results[key].video != undefined) {
                        value = (results[key].video);
                        if (value.duration.length <= c.timeSearch && value.duration != "Live") {
                            num = num += 1;
                            link.push(value.url);
                            let time = value.duration;
                            msg += `${num}.《${time}》 ${value.title}\n\n`;
                        }
                    }
                }
                var bodySend = `»🔎 There are ${link.length} results matching your search keyword:\n\n${msg}» Please reply (feedback) choose one of the above searches.`;
                api.sendMessage({
                        body: bodySend
                    }, threadID, (error, info) => {
                        global.client.reply.push({
                            step: "reply_bodySend",
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            idYT: link
                        })
                    },
                    messageID);
                return;
            }
            break;

        case "reply_bodySend":
            global.client.reply.splice(global.client.reply.indexOf(reply), 1);
            if (number(body)) return api.sendMessage('Choose from 1 -> 20, baby. love uwu ❤️', threadID, messageID);
            api.unsendMessage(reply.messageID);
            await checkSend(reply.idYT[body - 1], api, event);
            break;

        default:
            break;
    }
}