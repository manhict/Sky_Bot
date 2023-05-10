'use strict';
export const config = {
    name: 'cardbox',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Card box.',
    enDesc: 'Card box.',
    category: ['Edit Card', 'Edit Card'],
    usage: '',
    timestamp: 5
};

import jimp from 'jimp';
import path from 'path'
import axios from 'axios'
import * as fs from 'fs'
import { registerFont, loadImage, createCanvas } from 'canvas';

const fontsName = 45
const fontsInfo = 33
const fontsOthers = 27
const colorName = "#00FF00"

export async function circle(image){
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}
export async function onMessage({ api, event, args, Config }) {
    if(!event.isGroup) return;
    let { senderID, threadID, messageID } = event;
    let pathImg = process.cwd() + `/caches/${Date.now()-1}.png`;
    let pathAva = process.cwd() + `/caches/${Date.now()-2}.png`;
    let pathAvata = process.cwd() + `/caches/${Date.now()-3}.png`;
    let pathAvata2 = process.cwd() + `/caches/${Date.now()-4}.png`;
    let pathAvata3 = process.cwd() + `/caches/${Date.now()-5}.png`;

  try{
    var threadInfo = await api.getThreadInfo(threadID);
    let threadName = threadInfo.threadName;
    var nameMen = [],
        gendernam = [],
        gendernu = [],
        nope = [];

    for (let z in threadInfo.userInfo) {
        var gioitinhone = threadInfo.userInfo[z].gender;
        var nName = threadInfo.userInfo[z].name;
        if (gioitinhone == 'MALE') {
            gendernam.push(z + gioitinhone);
        } else if (gioitinhone == 'FEMALE') {
            gendernu.push(gioitinhone);
        } else {
            nope.push(nName);
        }
    }

    var nam = gendernam.length;
    var nu = gendernu.length;
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount;
    let threadMem = threadInfo.participantIDs.length;
    /*-----------------download----------------------*/
    const fonts = "/caches/fonts/Play-Bold.ttf"
    const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
    const dirMaterial = process.cwd() + `/caches/fonts/`;
    if (!fs.existsSync(dirMaterial + "fonts")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(process.cwd() + `${fonts}`)) {
        let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `${fonts}`, Buffer.from(getfont, "utf-8"));
    };
    /*---------------------------------------------*/
    var qtv2 = threadInfo.adminIDs;
    var idad = qtv2[Math.floor(Math.random() * qtv)];
    let idmem = threadInfo.participantIDs
    var idmemrd = idmem[Math.floor(Math.random() * threadMem)];
    var idmemrd1 = idmem[Math.floor(Math.random() * threadMem)];
   
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${idad.id}/picture?height=720&width=720&access_token=${Config.accessToken}`, { responseType: 'arraybuffer' })).data;
    let getAvatarOne2 = (await axios.get(`https://graph.facebook.com/${idmemrd}/picture?height=720&width=720&access_token=${Config.accessToken}`, { responseType: 'arraybuffer' })).data;
    let getAvatarOne3 = (await axios.get(`https://graph.facebook.com/${idmemrd1}/picture?height=720&width=720&access_token=${Config.accessToken}`, { responseType: 'arraybuffer' })).data;
    let Avatar = (
        await axios.get(encodeURI(
            `${threadInfo.imageSrc}`), { responseType: "arraybuffer" })
    ).data;
    let getWanted = (
        await axios.get(encodeURI(`https://i.imgur.com/z8l2T0c.png`), {
            responseType: "arraybuffer",
        })
    ).data;
   
    fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
    fs.writeFileSync(pathAvata2, Buffer.from(getAvatarOne2, 'utf-8'));
    fs.writeFileSync(pathAvata3, Buffer.from(getAvatarOne3, 'utf-8'));
    let avatar = await this.circle(pathAva);
    let avataruser = await this.circle(pathAvata);
    let avataruser2 = await this.circle(pathAvata2);
    let avataruser3 = await this.circle(pathAvata3);
    fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAva = await loadImage(avatar);
    let baseAvata = await loadImage(avataruser);
    let baseAvata2 = await loadImage(avataruser2);
    let baseAvata3 = await loadImage(avataruser3);
    registerFont(process.cwd() + `${fonts}`, {
        family: "Play-Bold"
    });
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    let text = args.join(" ") || threadName;
    let id = threadInfo.threadID;
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAva, 80, 73, 285, 285);
    ctx.drawImage(baseAvata, 450, 422, 43, 43);
    ctx.drawImage(baseAvata2, 500, 422, 43, 43);
    ctx.drawImage(baseAvata3, 550, 422, 43, 43);
    ctx.font = `700 ${fontsName}px Arial`;
    ctx.fillStyle = `${colorName}`
    ctx.textAlign = "start";
    var fontSize = 40;
    ctx.fillText(text, 435, 125);
    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";
    var fontSize = 20;
    ctx.fillText(`» Number member: ${threadMem}`, 439, 199);
    ctx.fillText(`» Chat bot admin: ${qtv}`, 439, 243);
    ctx.fillText(`» Male: ${nam}`, 439, 287);
    ctx.fillText(`» Female: ${nu}`, 439, 331);
    ctx.fillText(`» Total messages: ${sl}`, 439, 379);
    ctx.font = `${fontsOthers}px Play-Bold`;
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";
    var fontSize = 20;
    ctx.fillText(`ID BOX: ${id}`, 18, 470);
    ctx.font = `${fontsOthers}px Play-Bold`;
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";
    var fontSize = 20;
    ctx.fillText(`Together ${parseInt(threadMem) - 3} other member...`, 607, 453);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    fs.unlinkSync(pathAva);
    fs.unlinkSync(pathAvata);
    fs.unlinkSync(pathAvata2);
    fs.unlinkSync(pathAvata3);

    return api.sendMessage({ attachment: fs.createReadStream(pathImg) },
        threadID,
        () => fs.unlinkSync(pathImg),
        messageID
    );
  }catch(err){return}
};
