'use strict';
export const config = {
    name: 'tiktok',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Tìm kiếm và tải video tiktok no watermark.',
    enDesc: 'Search and download tiktok no watermark videos.',
    category: ['Giải trí', 'Media'],
    usage: '[keySearch, url video]',
    timestamp: 5
};
import axios from 'axios';
import fetch from 'node-fetch';
import { createReadStream, statSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
var rdPath = `tiktok_` + Date.now();

export async function onMessage({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    if (args.join(" ").indexOf("https://") == 0) {
        const linkurl = (args.join(" ")).trim();
        api.sendMessage(`Loading, please wait...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));
        var data = await api.tiktokDL(linkurl);
        if (data.error || data == undefined) return api.sendMessage(data.error || '', threadID);
        var path = global.client.dirMain + `/caches/${rdPath}.mp4`;
        let desc = data.desc;
        let link = data.play_video;
        await global.utils.downloadFile(link, path)
        // writeFileSync(path, Buffer.from(getms.data, "utf-8"))
        const msg = await api.sendMessage({ body: desc, attachment: createReadStream(path) }, threadID, () => unlinkSync(path), messageID);
        return msg;

    } else if (args.join(" ") == "") {
        return api.sendMessage("Reply tin nhắn này nhập thời gian tìm kiếm Tiktok(Là 1 chữ số) Lọc theo ngày bạn muốn áp dụng cho kết quả\nCác giá trị có thể có (mặc định là 0):\n0 - mọi lúc; \n1 - ngày hôm qua; \n7 - tuần này; \n30 - tháng; 90 - 3 tháng; \n180 - 6 tháng\n\nVí dụ: 0", threadID, (err, info) => {
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
        let results,
            link = [],
            title = [],
            msg = "",
            num = 0,
            time;
        const keywordSearch = encodeURIComponent(args.join(" "));
        try {
            var data = await api.tiktokSearch(keywordSearch);
            if (data.error) return api.sendMessage(data.error, threadID);
        } catch (error) {
            return api.sendMessage(error, threadID, messageID);
        }
        for (let key of data) {
            link.push(key.video);
            title.push(key.desc);
            num = num += 1
            if (num == 1) var num1 = "⓵"
            if (num == 2) var num1 = "⓶"
            if (num == 3) var num1 = "⓷"
            if (num == 4) var num1 = "⓸"
            if (num == 5) var num1 = "⓹"
            if (num == 6) var num1 = "⓺"
            if (num == 7) var num1 = "⓻"
            if (num == 8) var num1 = "⓼"
            if (num == 9) var num1 = "⓽"
            if (num == 10) var num1 = "⓾"
            msg += (`${num1}.《${key.time}s》${key.desc}\n\n`);
        }
        var body = `»🔎 There are ${link.length} results matching your search keyword:\n\n${msg}» Please reply (feedback) choose one of the above searches.`;
        return api.sendMessage({
                body: body
            }, threadID, (error, info) => {
                global.client.reply.push({
                    step: "reply_bodySend",
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    tikTitle: title,
                    tikLink: link
                })
            },
            messageID);
    }
}

export async function onReply({ event, api, reply }) {
    const { threadID, senderID, messageID, body } = event;

    function number1(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 0 || x > 180);
    }

    function number(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 1 || x > 10);
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
            if (number1(body)) return api.sendMessage('Chọn từ 0 -> 180, baby. love uwu ❤️', threadID, messageID);
            sendC("Reply tin nhắn này nhập từ cần tìm kiếm hoặc url video", 2, content);
            break;

        case 2:
            content.keySearch = input;
            global.client.reply.splice(global.client.reply.indexOf(reply), 1);
            api.unsendMessage(reply.messageID);
            let c = content;
            if (c.keySearch.indexOf("https://") == 0) {
                const linkurl = (c.keySearch);
                api.sendMessage(`Loading, please wait...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));
                var data = await api.tiktokDL(linkurl);
                if (data.error) return api.sendMessage(data.error, threadID);
                var path = global.client.dirMain + `/caches/${rdPath}.mp4`;

                let desc = data.desc;
                let link = data.play_video;
                // const getms = await axios.get(link, { responseType: "arraybuffer" });
                // writeFileSync(path, Buffer.from(getms.data, "utf-8"))
                await global.utils.downloadFile(link, path)
                const msg = await api.sendMessage({ body: desc, attachment: createReadStream(path) }, threadID, () => unlinkSync(path), messageID);
                return msg;
            } else {
                let results,
                    link = [],
                    title = [],
                    msg = "",
                    num = 0,
                    time;
                const keywordSearch = encodeURIComponent(c.keySearch);
                try {
                    var data = await api.tiktokSearch(keywordSearch);
                    if (data.error) return api.sendMessage(data.error, threadID);
                } catch (error) {
                    return api.sendMessage(error.stack, threadID, messageID);
                }
                for (let key of data) {
                    link.push(key.video);
                    title.push(key.desc);
                    num = num += 1
                    if (num == 1) var num1 = "⓵"
                    if (num == 2) var num1 = "⓶"
                    if (num == 3) var num1 = "⓷"
                    if (num == 4) var num1 = "⓸"
                    if (num == 5) var num1 = "⓹"
                    if (num == 6) var num1 = "⓺"
                    if (num == 7) var num1 = "⓻"
                    if (num == 8) var num1 = "⓼"
                    if (num == 9) var num1 = "⓽"
                    if (num == 10) var num1 = "⓾"
                    msg += (`${num1}.《${key.time}s》${key.desc}\n\n`);
                }
                var msgSearch = `»🔎 There are ${link.length} results matching your search keyword:\n\n${msg}» Please reply (feedback) choose one of the above searches.`;
                return api.sendMessage({
                        body: msgSearch
                    }, threadID, (error, info) => {
                        global.client.reply.push({
                            step: "reply_bodySend",
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            tikTitle: title,
                            tikLink: link
                        })
                    },
                    messageID);
            }
            break;

        case "reply_bodySend":
            if (number(body)) return api.sendMessage('Choose from 1 -> 10, baby. love uwu ❤️', threadID, messageID);
            api.unsendMessage(reply.messageID);
            api.sendMessage(`Loading, please wait...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 30000));
            try {
                const title = reply.tikTitle[body - 1];
                const link = reply.tikLink[body - 1];
                var path = global.client.dirMain + `/caches/${rdPath}.mp4`;
                // const getms = await axios.get(link, { responseType: "arraybuffer" });
                // writeFileSync(path, Buffer.from(getms.data, "utf-8"))
                await global.utils.downloadFile(link, path)
                const msg = await api.sendMessage({ body: title, attachment: createReadStream(path) }, threadID, () => unlinkSync(path), messageID);
                return msg;
            } catch (e) {
                console.log(e.message);
                return api.sendMessage(e.message, threadID, messageID);
            }
            break;

        default:
            break;
    }
}