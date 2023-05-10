'use strict';
export const config = {
    name: 'avt',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Tạo ra một avt trên taoanhdep.',
    enDesc: 'Create a avt on taoanhdep.',
    category: ["Edit Card", "Edit Card"],
    usages: "",
    timestamp: 5
}

import fs from 'fs'
import request from 'request'
import axios from 'axios'

export async function onReply({ event, api, reply, Config }) {
    const webApi = Config['WEBAPI'],
        apikey = Config['APIKEY'];
    if (reply.author != event.senderID) return;
    const { threadID, messageID, senderID, body } = event;
    var id = reply.id;
    const name = this.config.name;
    switch (reply.type) {
        case "signature":
            {
                var id = reply.id;
                var names = reply.names;
                api.unsendMessage(reply.messageID);
                return api.sendMessage(`🔍 Bạn đã chọn chữ nền là ${event.body}\n\n[!] Reply tin nhắn này nhập vào chữ ký của bạn [!]`, threadID, function (err, info) {
                    return client.reply.push({
                        type: "create",
                        name,
                        author: senderID,
                        id: id,
                        names,
                        nen: event.body,
                        messageID: info.messageID
                    });
                }, messageID)
            }
        case "color":
            {
                var nen = reply.nen;
                var id = reply.id;
                var names = reply.names;
                api.unsendMessage(reply.messageID);
                return api.sendMessage(`🔍 Bạn đã chọn chữ ký : ${event.body}\n\n[!] Nhập màu của bạn (lưu ý: nhập tên tiếng anh của màu - Nếu không muốn nhập màu thì nhập "no") [!]`, threadID, function (err, info) {
                    return client.reply.push({
                        type: "create",
                        name,
                        author: senderID,
                        id: id,
                        nen: nen,
                        names,
                        ky: event.body,
                        messageID: info.messageID
                    });
                }, messageID)
            }
        case "create":
            {
                var nen = reply.nen;
                var ky = event.body;
                var id = reply.id;
                var names = reply.names;
                var color2 = ``;
                api.unsendMessage(reply.messageID);
                //console.log(webApi +'/avtWibu?id='+ id +'&chunen=='+nen+'&chuky='+ ky +'&apikey=' + apikey);
                api.sendMessage(`⏳ Đang khởi tạo chương trình tạo ảnh!`, threadID, (err, info) => {
                    setTimeout(() => {
                        api.unsendMessage(info.messageID);
                        var callback = () => api.sendMessage({ body: ``, attachment: fs.createReadStream(process.cwd() + "/caches/taoanhdep.png") }, event.threadID, () => fs.unlinkSync(process.cwd() + "/caches/taoanhdep.png"), event.messageID);
                        return request(encodeURI(webApi + '/avtWibu?id=' + id + '&chunen=' + nen + '&chuky=' + ky + '&apikey=' + apikey)).pipe(fs.createWriteStream(process.cwd() + '/caches/taoanhdep.png')).on('close', () => callback());
                    }, 2000);
                }, messageID);
            }
    }
}
export async function onMessage({ api, event, args, Config }) {
    const { threadID, messageID, senderID, body } = event;
    const webApi = Config['WEBAPI'];

    function number(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 0 || x > 969);
    }

    if (args[0] == "color") {
        var callback = () => api.sendMessage({ body: `Bảng Màu Tiếng Anh.`, attachment: fs.createReadStream(process.cwd() + "/caches/taoanhdep.png") }, event.threadID, () => fs.unlinkSync(process.cwd() + "/caches/taoanhdep.png"), event.messageID);
        return request(encodeURI(`https://www.studytienganh.vn/upload/2017/08/40.jpg`)).pipe(fs.createWriteStream(process.cwd() + '/caches/taoanhdep.png')).on('close', () => callback());
    } else if (args[0] == "help") {
        var s = args[1];
        if (s != "all") {
            if (s == "color") {
                var reason = `Dùng để xem danh sách màu!`;
            } else if (s == "list") {
                var reason = `Dùng để xem danh sách dữ liệu hiện có!`;
            } else if (s == "info") {
                var reason = `Xem info của 1 id nào đó!`;
            } else {
                return api.sendMessage(`<${s}> Không tồn tại!`, threadID, messageID);
            }
            return api.sendMessage(`${client.config.PREFIX}${this.config.name} ${s} <${reason}>`, threadID, messageID);
        } else {
            var lmao = `${client.config.PREFIX}${this.config.name} `;
            var msg = `${lmao}color <Dùng để xem danh sách màu!>\n\n${lmao}list <Dùng để xem danh sách dữ liệu hiện có!>\n\n${lmao}info [mã nhân vật] <Xem info của 1 id nào đó!>`;
            return api.sendMessage(msg, threadID, messageID);
        }
    } else if (args[0] == "info") {
        axios.get(webApi + '/' + 'listAvtPrivate').then(res => {
            var id = parseInt(args[1]) - parseInt(1);
            if (number(id)) return api.sendMessage(number(), threadID, messageID);
            let obj = res.data.result;
            //var obj = JSON.parse(data_anime);
            if (!obj) return api.sendMessage(`<${id}> Không có trong dữ liệu!`, threadID, messageID);
            else {
                //let nameMain = res.data.listAnime[id].name;
                //let link = obj[id].imgAnime;
                let ext = obj[id].imgAnime.substring(obj[id].imgAnime.lastIndexOf(".") + 1);
                let callback = function () {
                    api.sendMessage({
                        body: `💠ID nhân vật: ${id + 1}`,
                        attachment: fs.createReadStream(process.cwd() + `/caches/infotaoanhdep.${ext}`)
                    }, event.threadID, () => fs.unlinkSync(process.cwd() + `/caches/infotaoanhdep.${ext}`), event.messageID);
                };
                request(obj[id].imgAnime).pipe(fs.createWriteStream(process.cwd() + `/caches/infotaoanhdep.${ext}`)).on("close", callback);
            }
        })
    } else if (args[0] == "list") {
        axios.get(webApi + '/' + 'listAvt').then(res => {
            var count = res.data.result.length;
            var data = res.data.result
            var page = 1;
            page = parseInt(args[1]) || 1;
            page < -1 ? page = 1 : "";
            var limit = 15;
            var numPage = Math.ceil(count / limit);
            var msg = ``;
            for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                if (i >= count) break;
                msg += `[ ${i + 1} ] - ${data[i].name} | ${data[i].color}\n`;
            }
            msg += `Trang (${page}/${numPage})\nDùng ${client.config.PREFIX}${this.config.name} list <số trang>`;
            return api.sendMessage(msg, threadID, messageID);
        });
    } else {
        //if (senderID == api.getCurrentUserID()) return;
        var id = args[0];
        if (!id) id = Math.floor(Math.random() * 800) + 1;
        axios.get(webApi + 'listAvt').then(res => {
            if (!res.data.result[id]) return api.sendMessage(`Không tìm thấy dữ liệu!!!`, threadID, messageID);
            var names = res.data.result[id].name;
            return api.sendMessage(`🔍 Đã tìm thấy ID nhân vật : ${id}\n🧬 Name nhân vật là ${res.data.result[id].name}\n\n[!] Reply tin nhắn này và chọn chữ nền cho hình ảnh của bạn [!]`, event.threadID, (err, info) => {
                return client.reply.push({
                    type: "signature",
                    name: this.config.name,
                    author: senderID,
                    id: id,
                    names,
                    messageID: info.messageID
                });
            }, event.messageID);
        })
    }
}
