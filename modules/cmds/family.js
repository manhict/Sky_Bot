'use strict';
export const config = {
    name: 'family',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tạo hình ảnh tất cả vào hộp thành viên',
    enDesc: 'Create all members of family photo',
    category: ['Edit Card', 'Edit Card'],
    usages: '',
    timestamp: 5,
    packages: ['jimp', 'canvas', 'node-superfetch']
};

import jimp from 'jimp';
import superfetch from 'node-superfetch'
import axios from 'axios'
import * as Canvas from 'canvas';
import * as fs from 'fs'

export async function circle(image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}
export async function onMessage({ event, api, args, Threads, Users, Config }) {
    if(!event.isGroup) return;
    const img = new Canvas.Image();
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };
    const { threadID, messageID, participantIDs } = event;
    let live = [],
        admin = [],
        i = 0;
    if (args[0] == 'help' || args[0] == '0' || args[0] == '-h') return api.sendMessage('User: ' + this.config.name + ' [size avt]' + ' [color code]' + ' [tên nhóm (title)] || Leave all bots blank, they will get information automatically', threadID, messageID)
        /*============DOWNLOAD FONTS=============*/
    if (!fs.existsSync(process.cwd() + `/caches/TUVBenchmark.ttf`)) {
        let downFonts = (await axios.get(`https://drive.google.com/u/0/uc?id=1NIoSu00tStE8bIpVgFjWt2in9hkiIzYz&export=download`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/TUVBenchmark.ttf`, Buffer.from(downFonts, "utf-8"));
    };
    /*===========BACKGROUND & AVATAR FRAMES==========*/
    var bg = ['https://i.imgur.com/P3QrAgh.jpg', 'https://i.imgur.com/RueGAGI.jpg', 'https://i.imgur.com/bwMjOdp.jpg', 'https://i.imgur.com/trR9fNf.jpg']
    var background = await Canvas.loadImage(bg[Math.floor(Math.random() * bg.length)]);
    var bgX = background.width;
    var bgY = background.height;
    var khungAvt = await Canvas.loadImage("https://i.imgur.com/gYxZFzx.png")
    const imgCanvas = Canvas.createCanvas(bgX, bgY);
    const ctx = imgCanvas.getContext('2d');
    ctx.drawImage(background, 0, 0, imgCanvas.width, imgCanvas.height);
    /*===============GET INFO GROUP CHAT==============*/
    var { adminIDs, name, userInfo } = await api.getThreadInfo(threadID);
    // const threadData = await Threads.getData(threadID);
    //var { adminIDs, name } = threadData;

    for (let idAD of adminIDs) { admin.push(idAD.id) };
    /*=====================REMOVE ID DIE===================*/
    for (let _idUser of userInfo) {
        if (_idUser.gender != undefined) { live.push(_idUser) }
    }
    /*======================CUSTOM====================*/
    let size, color, title
    var image = bgX * (bgY - 200);
    var sizeParti = Math.floor(image / live.length);
    var sizeAuto = Math.floor(Math.sqrt(sizeParti));
    if (!args[0]) {
        size = sizeAuto;
        color = '#FFFFFF';
        title = encodeURIComponent(name)
    } else {
        size = parseInt(args[0]);
        color = args[1] || '#FFFFFF';
        title = args.slice(2).join(" ") || name;
    }
    /*===========DISTANCE============*/
    var l = parseInt(size / 15),
        x = parseInt(l),
        y = parseInt(200),
        xcrop = parseInt(live.length * size),
        ycrop = parseInt(200 + size);
    size = size - l * 2;
    /*================CREATE PATH AVATAR===============*/
    api.sendMessage(`» Estimated photo: ${participantIDs.length}\n» Size background: ${bgX} x ${bgY}\n» Size Avatar: ${size}\n» Color: ${color}`, threadID, messageID);
    var pathAVT = (process.cwd() + `/caches/${Date.now()+10000}.png`)
        /*=================DRAW AVATAR MEMBERS==============*/
    for (let idLive of live) {
        // console.log(idLive.id)
        var idUser = idLive.id, avtUser = '';
        // console.log("Vẽ: " + idUser);
        
        try { avtUser = await superfetch.get(`https://graph.facebook.com/${idUser}/picture?width=500&height=500&access_token=${Config.accessToken}`) } catch (e) { continue }
        
        if (x + size > bgX) {
            xcrop = x;
            x += (-x) + l;
            y += size + l;
            ycrop += size + l
        };
        if (ycrop > bgY) { ycrop += (-size); break };
        avtUser = avtUser.body;
        // console.log(avtUser);
        var avatar = await this.circle(avtUser);
        var avatarload = await Canvas.loadImage(avatar);
        img.src = avatarload;
        ctx.drawImage(avatarload, x, y, size, size);
        if (admin.includes(idUser)) { ctx.drawImage(khungAvt, x, y, size, size) };
        i++
        // console.log("\x1b[32mDone: \x1b[37m" + idUser);
        x += parseInt(size + l);
    }
    /*==================DRAW TITLE==================*/
    Canvas.registerFont(process.cwd() + `/caches/TUVBenchmark.ttf`, { family: "TUVBenchmark" });
    ctx.font = "120px TUVBenchmark";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(decodeURIComponent(title), xcrop / 2, 133);
    /*===================CUT IMAGE===================*/
    console.log(`Vẽ thành công ${i} avt`)
    console.log(`Lọc thành công ${participantIDs.length-i} Facebook users`)
    const cutImage = await jimp.read(imgCanvas.toBuffer());
    cutImage.crop(0, 0, xcrop, ycrop + l - 30).writeAsync(pathAVT);
    await delay(300);
    /*====================SEND IMAGE==================*/
    return api.sendMessage({ body: `» Number member: ${i}\n» Size background: ${bgX} x ${bgY}\n» Filter ${participantIDs.length-i} Facebook users`, attachment: fs.createReadStream(pathAVT) }, threadID, (error, info) => {
        if (error) return api.sendMessage(`Đã xảy ra lỗi ${error}`, threadID, () => fs.unlinkSync(pathAVT), messageID)
        console.log('\x1b[31mGửi ảnh thành công\x1b[37m');
        fs.unlinkSync(pathAVT)
    }, messageID);
}
//export FONTCONFIG_PATH=/etc/fonts