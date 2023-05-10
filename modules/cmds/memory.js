'use strict';
export const config = {
    name: 'memory',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Trò chơi thử thách trí nhớ của bạn.',
    enDesc: 'Game to challenge your memory.',
    category: ['Game', 'Game'],
    usages: "",
    timestamp: 5
};

import { registerFont, loadImage, createCanvas, Canvas } from 'canvas';
import fs from 'fs';
import axios from 'axios';
import path from 'path';

function wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';
        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
};

export async function onEvent({ api, event, args }) {
    if (!global.gamememory) return;
    let { body, senderID, messageID, threadID } = event;
    var gamememory = global.gamememory;
    if (gamememory.has(event.senderID.toString())) {
        var result1 = body;
        var resulttrue = gamememory.get(senderID);
        if (resulttrue.toLocaleLowerCase() == result1.toLocaleLowerCase()) {
            api.sendMessage("You Win!!", threadID, messageID);
        } else {
            api.sendMessage("You Lose!! The result is correct: " + resulttrue.toUpperCase(), threadID, messageID);
        }
        global.gamememory.delete(senderID);
    };
}

export async function onMessage({ api, event, args }) {
    let { senderID, threadID, messageID } = event;
    if (!args[0]) return api.sendMessage("You need to enter level (1-20)", threadID, messageID);
    if (isNaN(args[0]) == true) return api.sendMessage("The level you choose must be a number (1-20)", threadID, messageID);
    const level = args[0];
    if (level < 1 || level > 20) return api.sendMessage("The level you choose must be in the range of 1 -> 20", threadID, messageID);

    if (!fs.existsSync(process.cwd() + "/caches/memory.ttf")) {
        let getfont = (await axios.get(`https://manhkhac.github.io/data/font/Montserrat-Bold.ttf`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + "/caches/memory.ttf", Buffer.from(getfont, "utf-8"));
    }
    var imgrd = "https://manhkhac.github.io/data/img/memory.jpg";
    var getimg = (await axios.get(imgrd, { responseType: "arraybuffer" })).data;
    var pathImg = process.cwd() + '/caches/memorygame.png';
    fs.writeFileSync(pathImg, Buffer.from(getimg, "utf-8"));

    const directions = ['up', 'down', 'left', 'right'];
    const colors = ['red', 'blue', 'green', 'black'];
    const fruits = ['apple', 'orange', 'pear', 'banana'];
    const animals = ["cat", "dog", "snake", "fox", "lion"];
    const onepieces = ["luffy", "zoro", "robin", "sanji", "nami", "chopper", "usopp"];

    function genArray(level) {
        const sourceArr = [colors, directions, fruits, onepieces, animals][Math.floor(Math.random() * 3)];
        const arr = [];
        for (let i = 0; i < level; i++) arr.push(sourceArr[Math.floor(Math.random() * sourceArr.length)]);
        return arr;
    };

    const memorize = genArray(level);
    const memorytext1 = memorize.map(word => `${word.toUpperCase()}`).join(' ');

    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    const __root = path.resolve(process.cwd(), "cache", "rank");

    registerFont(process.cwd() + "/caches/memory.ttf", {
        family: "NTK",
        weight: "regular",
        style: "normal"
    });

    ctx.font = "19px NTK"; //Courier New
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    const memorytext2 = wrapText(ctx, memorytext1, baseImage.width);

    ctx.fillText((await memorytext2).join("\n"), baseImage.width / 2, baseImage.height / 2);
    ctx.beginPath();

    const imageBuffer = canvas.toBuffer();

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage({ body: "You have 10 seconds to memorize the content below, then retype it!!", attachment: fs.createReadStream(pathImg) }, threadID, async (e, info) => {
        fs.unlinkSync(pathImg);
        await delay(10000);
        api.unsendMessage(info.messageID);
        if (!global.gamememory) global.gamememory = new Map();
        global.gamememory.set(senderID.toString(), memorytext1);
    },
        messageID
    );
};