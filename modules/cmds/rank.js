'use strict';
export const config = {
    name: 'rank',
    version: '1.0.0',
    role: 0,
    author: ['ManhG remake Banledangyeu'],
    viDesc: 'Lấy rank hiện tại của bạn trên hệ thống bot kèm khung theo level của bạn, remake rank_card from canvacord.',
    enDesc: 'Get your current rank on the bot system with a frame according to your level, remake rank_card from canvacord.',
    category: ['Edit Card', 'Edit Card'],
    usages: "[@tag]",
    timestamp: 5
};

import fs, { existsSync, mkdirSync } from 'fs'
import path, { resolve } from 'path'
import request from 'node-superfetch';
import Canvas, { createCanvas, loadImage } from 'canvas';
import jimp from 'jimp'

const __root = path.resolve(process.cwd() + "/caches/rankcard");

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function makeRankCard(data) {
    /*
     * 
     * Remake from Canvacord
     * 
     */
    const PI = Math.PI;

    const { id, name, rank, level, expCurrent, expNextLevel } = data;

    Canvas.registerFont(__root + "/regular-font.ttf", {
        family: "Manrope",
        weight: "regular",
        style: "normal"
    });
    Canvas.registerFont(__root + "/bold-font.ttf", {
        family: "Manrope",
        weight: "bold",
        style: "normal"
    });
    //random rankcard by Siêu Đáng Yêu(xin vui lòng giữ credit)
    const pathCustom = path.resolve(process.cwd(), "caches/rankcard", "customrank");
    var customDir = fs.readdirSync(pathCustom);
    let random = Math.floor(Math.random() * 24) + 1;
    var dirImage = __root + "/rankcard" + random + ".png";


    customDir = customDir.map(item => item.replace(/\.png/g, ""));

    for (singleLimit of customDir) {
        var limitRate = false;
        const split = singleLimit.split(/-/g);
        var min = parseInt(split[0]),
            max = parseInt((split[1]) ? split[1] : min);

        for (; min <= max; min++) {
            if (level == min) {
                limitRate = true;
                break;
            }
        }

        if (limitRate == true) {
            dirImage = pathCustom + `/${singleLimit}.png`;
            break;
        }
    }

    let rankCard = await Canvas.loadImage(dirImage);
    const pathImg = __root + `/rank_${id}.png`;

    var expWidth = (expCurrent * 615) / expNextLevel;
    if (expWidth > 615 - 18.5) expWidth = 615 - 18.5;

    let avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${client.config.accessToken}`);

    avatar = await circle(avatar.body);

    const canvas = Canvas.createCanvas(934, 282);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(avatar), 45, 50, 180, 180);

    ctx.font = `bold 36px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "start";
    ctx.fillText(name, 270, 164);
    ctx.font = `36px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "center";

    ctx.font = `bold 32px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "end";
    ctx.fillText(level, 934 - 55, 82);
    ctx.fillStyle = getRandomColor();
    ctx.fillText("Lv.", 934 - 55 - ctx.measureText(level).width - 10, 82);

    ctx.font = `bold 32px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "end";
    ctx.fillText(rank, 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 25, 82);
    ctx.fillStyle = getRandomColor();
    ctx.fillText("#", 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 16 - ctx.measureText(rank).width - 16, 82);

    ctx.font = `bold 26px Manrope`;
    ctx.fillStyle = getRandomColor();
    ctx.textAlign = "start";
    ctx.fillText("/ " + expNextLevel, 710 + ctx.measureText(expCurrent).width + 10, 164);
    ctx.fillStyle = getRandomColor();
    ctx.fillText(expCurrent, 710, 164);

    ctx.beginPath();
    ctx.fillStyle = getRandomColor();
    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * PI, 0.5 * PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
    ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * PI, 0.5 * PI, false);
    ctx.fill();

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    return pathImg;
}

async function circle(image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

function expToLevel(point) {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
}

function levelToExp(level) {
    if (level <= 0) return 0;
    return 3 * level * (level - 1);
}

async function getInfo(uid, Users) {
    let point = (await Users.getData(uid)).exp;
    const level = expToLevel(point);
    const expCurrent = point - levelToExp(level);
    const expNextLevel = levelToExp(level + 1) - levelToExp(level);
    return { level, expCurrent, expNextLevel };
}

export async function onLoad() {
    const downloadFile = global.utils.downloadFileHttps;
    const path = resolve(process.cwd(), "caches/rankcard", "customrank");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
    //hàm dowload file có sẵn bao gồm font chữ hoặc pang rankcard (có thể thay)
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'regular-font.ttf'))) await downloadFile("https://manhkhac.github.io/data/font/regular-font.ttf", resolve(process.cwd(), 'caches/rankcard', 'regular-font.ttf'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'bold-font.ttf'))) await downloadFile("https://manhkhac.github.io/data/font/bold-font.ttf", resolve(process.cwd(), 'caches/rankcard', 'bold-font.ttf'));

    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard1.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard1.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard1.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard2.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard2.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard2.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard3.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard3.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard3.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard4.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard4.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard4.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard5.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard5.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard5.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard6.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard6.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard6.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard7.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard7.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard7.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard8.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard8.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard8.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard9.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard9.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard9.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard10.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard10.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard10.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard11.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard11.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard11.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard12.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard12.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard12.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard13.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard13.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard13.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard14.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard14.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard14.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard15.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard15.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard15.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard16.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard16.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard16.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard17.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard17.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard17.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard18.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard18.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard18.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard19.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard19.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard19.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard20.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard20.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard20.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard21.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard21.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard21.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard22.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard22.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard22.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard23.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard23.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard23.png'));
    if (!existsSync(resolve(process.cwd(), 'caches/rankcard', 'rankcard24.png'))) await downloadFile("https://manhkhac.github.io/data/rankcard/rankcard.png", resolve(process.cwd(), 'caches/rankcard', 'rankcard24.png'));
}

export async function onMessage({ event, api, args, Users }) {
    let dataAll = (await Users.getKey(["id", "exp"]));
    const mention = Object.keys(event.mentions);

    dataAll.sort((a, b) => {
        if (a.exp > b.exp) return -1;
        if (a.exp < b.exp) return 1;
    });

    if (mention.length == 1) {
        const rank = dataAll.findIndex(item => parseInt(item.id) == parseInt(mention[0])) + 1;
        const name = (await Users.getData(mention[0])).name;
        if (rank == 0) return api.sendMessage("Bạn hiện không có trong cơ sở dữ liệu nên không thể thấy thứ hạng của mình, vui lòng thử lại sau 5 giây.", event.threadID, event.messageID);
        let point = await getInfo(mention[0], Users);
        let pathRankCard = await makeRankCard({ id: mention[0], name, rank, ...point })
        await api.sendMessage({ body: global.data.allUserData[mention[0]].exp, attachment: fs.createReadStream(pathRankCard) }, event.threadID, event.messageID);
        return fs.unlinkSync(pathRankCard)
    } else if (mention.length > 1) {
        for (const id of mention) {
            const rank = dataAll.findIndex(item => parseInt(item.id) == parseInt(id)) + 1;
            const name = (await Users.getData(id)).name;
            if (rank == 0) return api.sendMessage("Bạn hiện không có trong cơ sở dữ liệu nên không thể thấy thứ hạng của mình, vui lòng thử lại sau 5 giây.", event.threadID, event.messageID);
            let point = await getInfo(id, Users);
            let pathRankCard = await makeRankCard({ id: id, name, rank, ...point })
            await api.sendMessage({ body: global.data.allUserData[id].exp, attachment: fs.createReadStream(pathRankCard) }, event.threadID, event.messageID);
            return fs.unlinkSync(pathRankCard)
        }
    } else {
        const rank = dataAll.findIndex(item => parseInt(item.id) == parseInt(event.senderID)) + 1;
        const name = (await Users.getData(event.senderID)).name;
        if (rank == 0) return api.sendMessage("Bạn hiện không có trong cơ sở dữ liệu nên không thể thấy thứ hạng của mình, vui lòng thử lại sau 5 giây.", event.threadID, event.messageID);
        const point = await getInfo(event.senderID, Users);
        let pathRankCard = await makeRankCard({ id: event.senderID, name, rank, ...point })
        await api.sendMessage({ body: global.data.allUserData[event.senderID].exp, attachment: fs.createReadStream(pathRankCard, { 'highWaterMark': 128 * 1024 }) }, event.threadID, event.messageID);
        return fs.unlinkSync(pathRankCard)
    }
}