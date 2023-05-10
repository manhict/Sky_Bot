'use strict';
export const config = {
    name: 'carduser',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tạo card thông tin người dùng facebook',
    enDesc: 'Create card information user facebook',
    category: ['Edit Card', 'Edit Card'],
    usages: "",
    timestamp: 5
};

import Canvas, { loadImage, createCanvas } from 'canvas'
import axios from 'axios';
import * as fs from 'fs'
import jimp from 'jimp'

let fonts = process.cwd() + "/caches/fonts/Play-Bold.ttf"
let downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
let fontsLink = 20
let fontsInfo = 28
let colorName = "#00FF00";

var rdPath = `carduser_` + (Date.now());
var pathImg = process.cwd() + `/caches/${rdPath +1}.png`;
var pathAvata = process.cwd() + `/caches/${rdPath}.png`;

export async function circle(image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}
export async function onMessage({ api, event, args, Config }) {
    let { senderID, threadID, messageID } = event;
    let id;

    if (event.type == "message_reply") id = event.messageReply.senderID
        else if (args.join(" ").indexOf("https://") == 0) {
                id = (await api.findUID(args[0]));
            }
    else id = Object.keys(event.mentions)[0] || args[0] || event.senderID;
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=${Config.accessToken}`, { responseType: 'arraybuffer' })).data;
    let bg = (
        await axios.get(encodeURI(`https://i.imgur.com/8UaB48J.png`), {
            responseType: "arraybuffer",
        })
    ).data;
    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
    let avataruser = await this.circle(pathAvata);
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    /*-----------------download----------------------*/
    const dirMaterial = process.cwd() + `/caches/fonts/`;
    if (!fs.existsSync(dirMaterial + "fonts")) fs.mkdirSync(dirMaterial, { recursive: true });

    if (!fs.existsSync(fonts)) {
        let getfont = (await axios.get(downfonts, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(fonts, Buffer.from(getfont, "utf-8"));
    };

    /*---------------------------------------------*/
    let baseImage = await loadImage(pathImg);
    let baseAvata = await loadImage(avataruser);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 80, 73, 285, 285);
    var dataUser = await api.getUser(id);
    if(!dataUser) return;
    var gender = dataUser.gender || "Gay";
    var birthday = dataUser.birthday || Private;
    var love = dataUser.relationship || Private;
    var location = dataUser.location || Private;
    Canvas.registerFont(fonts, {
        family: "Play-Bold"
    });
    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";
    var fontSize = 20;
    ctx.fillText(`» Name: ${dataUser.name}`, 455, 172);
    ctx.fillText(`» Sex: ${gender}`, 455, 208);
    ctx.fillText(`» Follow: ${dataUser.follow}`, 455, 244);
    ctx.fillText(`» Relationship: ${love}`, 455, 281);
    ctx.fillText(`» Birthday: ${birthday}`, 455, 320);
    ctx.fillText(`» Location: ${location}`, 455, 357);
    ctx.fillText(`» UID: ${id}`, 455, 397);
    ctx.font = `${fontsLink}px Play-Bold`;
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";
    var fontSize = 20;
    ctx.fillText(`» Profile: ${dataUser.profileUrl}`, 19, 468);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    await api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID);
    if(pathImg && pathAvata) {
       fs.unlinkSync(pathAvata);
       return fs.unlinkSync(pathImg)}
    };
