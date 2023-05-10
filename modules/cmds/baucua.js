'use strict';
export const config = {
    name: 'baucua',
    version: '1.0.0',
    role: 0,
    author: ['DuyVuong'],
    viDesc: 'Chơi game baucua',
    enDesc: 'Play game baucua',
    category: ['Game', 'Game'],
    usages: '',
    timestamp: 0
}

import axios from 'axios';
import fs from 'fs';

var gif = 'https://i.imgur.com/TdFtFCC.gif',
    bauuu = 'https://i.imgur.com/1MZ2RUz.jpg',
    cuaaa = 'https://i.imgur.com/OrzfTwg.jpg',
    tommm = 'https://i.imgur.com/8nTJyNK.jpg',
    caaa = 'https://i.imgur.com/EOH26Am.jpg',
    naiii = 'https://i.imgur.com/sPP6Glh.jpg',
    gaaa = 'https://i.imgur.com/uV4eyKs.jpg';

export async function onMessage({ event, api, Users, args }) {
    const { senderID, threadID, body, messageID } = event;
    const money = (await Users.getData(event.senderID)).money;
    const a = function (a) { api.sendMessage(a, event.threadID, event.messageID) }

    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };
    let gifBaucua = (await axios.get(gif, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/${event.senderID}.gif`, Buffer.from(gifBaucua, "utf-8"));
    var gifBaucua_push = [];
    gifBaucua_push.push(fs.createReadStream(process.cwd() + `/caches/${event.senderID}.gif`));
    if (!args[0]) { return api.sendMessage(`Vui lòng nhập bầu/cua/tôm/cá/nai/gà và số tiền cược`, event.threadID, event.messageID) }
    const list1 = ['bầu', 'cua', 'tôm', 'cá', 'nai', 'gà'];
    const ketqua_1 = list1[Math.floor(Math.random() * list1.length)];
    const ketqua_2 = list1[Math.floor(Math.random() * list1.length)];
    const ketqua_3 = list1[Math.floor(Math.random() * list1.length)];
    const join = args[0],
        bau = "bầu",
        cua = "cua",
        tom = "tôm",
        ca = "cá",
        nai = "nai",
        ga = "gà"
    if (join != bau && join != cua && join != tom && join != ca && join != nai && join != ga) { return api.sendMessage("Vui lòng nhập bầu/cua/tôm/cá/nai/gà và số tiền cược", event.threadID, event.messageID); }
    const coins = args[1] || 100;
    if (coins < 50 || isNaN(coins)) return api.sendMessage("Mức cược không phù hợp hoặc dưới 50$!!", threadID, messageID);
    if (join == "bầu") { var join1 = "🍐" }
    if (join == "cua") { var join1 = "🦀" }
    if (join == "tôm") { var join1 = "🦞" }
    if (join == "cá") { var join1 = "🐟" }
    if (join == "nai") { var join1 = "🦌" }
    if (join == "gà") { var join1 = "🐓" }
    if (ketqua_1 == "bầu" || ketqua_2 == "bầu" || ketqua_3 == "bầu") {
        var icon_1 = "🍐",
            path_1 = "bau";
        let img_bau = (await axios.get(bauuu, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_1}.png`, Buffer.from(img_bau, "utf-8"));
    }
    if (ketqua_1 == "cua") {
        var icon_1 = "🦀",
            path_1 = "cua";
        let img_cua = (await axios.get(cuaaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_1}.png`, Buffer.from(img_cua, "utf-8"));
    }
    if (ketqua_1 == "tôm") {
        var icon_1 = "🦞",
            path_1 = "tom";
        let img_tom = (await axios.get(tommm, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_1}.png`, Buffer.from(img_tom, "utf-8"));
    }
    if (ketqua_1 == "cá") {
        var icon_1 = "🐟",
            path_1 = "ca";
        let img_ca = (await axios.get(caaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_1}.png`, Buffer.from(img_ca, "utf-8"));
    }
    if (ketqua_1 == "nai") {
        var icon_1 = "🦌",
            path_1 = "nai";
        let img_nai = (await axios.get(naiii, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_1}.png`, Buffer.from(img_nai, "utf-8"));
    }
    if (ketqua_1 == "gà") {
        var icon_1 = "🐓",
            path_1 = "ga";
        let img_ga = (await axios.get(gaaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_1}.png`, Buffer.from(img_ga, "utf-8"));
    }
    if (ketqua_2 == "bầu") {
        var icon_2 = "🍐",
            path_2 = "bau"
        let img_bau = (await axios.get(bauuu, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_2}.png`, Buffer.from(img_bau, "utf-8"));
    }
    if (ketqua_2 == "cua") {
        var icon_2 = "🦀",
            path_2 = "cua"
        let img_cua = (await axios.get(cuaaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_2}.png`, Buffer.from(img_cua, "utf-8"));
    }
    if (ketqua_2 == "tôm") {
        var icon_2 = "🦞",
            path_2 = "tom"
        let img_tom = (await axios.get(tommm, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_2}.png`, Buffer.from(img_tom, "utf-8"));
    }
    if (ketqua_2 == "cá") {
        var icon_2 = "🐟",
            path_2 = "ca"
        let img_ca = (await axios.get(caaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_2}.png`, Buffer.from(img_ca, "utf-8"));
    }
    if (ketqua_2 == "nai") {
        var icon_2 = "🦌",
            path_2 = "nai"
        let img_nai = (await axios.get(naiii, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_2}.png`, Buffer.from(img_nai, "utf-8"));
    }
    if (ketqua_2 == "gà") {
        var icon_2 = "🐓",
            path_2 = "ga"
        let img_ga = (await axios.get(gaaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_2}.png`, Buffer.from(img_ga, "utf-8"));
    }
    if (ketqua_3 == "bầu") {
        var icon_3 = "🍐",
            path_3 = "bau"
        let img_bau = (await axios.get(bauuu, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_3}.png`, Buffer.from(img_bau, "utf-8"));
    }
    if (ketqua_3 == "cua") {
        var icon_3 = "🦀",
            path_3 = "cua"
        let img_cua = (await axios.get(cuaaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_3}.png`, Buffer.from(img_cua, "utf-8"));
    }
    if (ketqua_3 == "tôm") {
        var icon_3 = "🦞",
            path_3 = "tom"
        let img_tom = (await axios.get(tommm, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_3}.png`, Buffer.from(img_tom, "utf-8"));
    }
    if (ketqua_3 == "cá") {
        var icon_3 = "🐟",
            path_3 = "ca"
        let img_ca = (await axios.get(caaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_3}.png`, Buffer.from(img_ca, "utf-8"));
    }
    if (ketqua_3 == "nai") {
        var icon_3 = "🦌",
            path_3 = "nai"
        let img_nai = (await axios.get(naiii, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_3}.png`, Buffer.from(img_nai, "utf-8"));
    }
    if (ketqua_3 == "gà") {
        var icon_3 = "🐓",
            path_3 = "ga"
        let img_ga = (await axios.get(gaaa, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/${path_3}.png`, Buffer.from(img_ga, "utf-8"));
    }
    var imgBaucua = [];
    imgBaucua.push(fs.createReadStream(process.cwd() + `/caches/${path_1}.png`));
    imgBaucua.push(fs.createReadStream(process.cwd() + `/caches/${path_2}.png`));
    imgBaucua.push(fs.createReadStream(process.cwd() + `/caches/${path_3}.png`));
    if (money < coins) return api.sendMessage(`⚡️Số dư bạn không đủ ${coins}$ để có thể chơi`, event.threadID, event.messageID);
    if (join == ketqua_1 && join == ketqua_2 && join == ketqua_3) {
        await Users.setData(event.senderID, { money: money + coins * 3 })
        if (ketqua_1 == "🍐") {
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 3}$, có 3 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        } else if (ketqua_1 == "🦞") {
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 3}$, có 3 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        } else if (ketqua_1 == "🦀") {
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 3}$, có 3 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        } else if (ketqua_1 == "🐟") {
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 3}$, có 3 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        } else if (ketqua_1 == "🦌") {
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 3}$, có 3 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        } else if (ketqua_1 == "🐓") {
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 3}$, có 3 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        }
    } else {
        if (join == ketqua_1 && join == ketqua_2 || join == ketqua_2 && join == ketqua_3 || join == ketqua_1 && join == ketqua_3) {
            await Users.setData(event.senderID, { money: money + coins * 2 })
            var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
            api.sendMessage(msg1, event.threadID, async function (error, info) {
                await delay(3000);
                api.unsendMessage(info.messageID);
            })
            var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins * 2}$, có 2 ${join1}`, attachment: imgBaucua }
            await delay(8000);
            a(msg)
        } else {
            if (join == ketqua_1 || join == ketqua_2 || join == ketqua_3) {
                await Users.setData(event.senderID, { money: parseInt(money) + parseInt(coins) })
                var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
                api.sendMessage(msg1, event.threadID, async function (error, info) {
                    await delay(3000);
                    api.unsendMessage(info.messageID);
                })
                var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Nhận: ${coins}$, có 1 ${join1}`, attachment: imgBaucua }
                await delay(8000);
                a(msg)
            } else {
                await Users.setData(event.senderID, { money: money - coins })
                var msg1 = { body: "» Đang lắc...", attachment: gifBaucua_push }
                api.sendMessage(msg1, event.threadID, async function (error, info) {
                    await delay(3000);
                    api.unsendMessage(info.messageID);
                })
                var msg = { body: `» Kết quả: ${icon_1} | ${icon_2} | ${icon_3}\n» Trừ: ${coins}$, có 0 ${join1}`, attachment: imgBaucua }
                await delay(8000);
                a(msg)
            };
        };
    };
}