'use strict';
export const config = {
    name: 'say',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Make the bot return google audio file via text.',
    enDesc: 'Make the bot return google audio file via text.',
    category: ['Tiện ích', 'Utility'],
    usages: '',
    timestamp: 5
};

import * as fs from 'fs';
import axios from 'axios';

var pathMp3 = process.cwd() + `/caches/${Date.now()}-say.mp3`;
export async function onMessage({ event, api, args }) {
  process.on('unhandledRejection', (error, p) => {
     return;
  });
  try{
    var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
    var languageToSay = (["ru", "en", "ko", "ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : 'vi';
    var msg = (languageToSay != 'vi') ? content.slice(3, content.length) : content;
    let sound;
        sound = (await axios.get(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathMp3, Buffer.from(sound, "utf-8"));
    api.sendMessage({ body: "", attachment: fs.createReadStream(pathMp3) }, event.threadID, () => fs.unlinkSync(pathMp3));
  }
  catch(err) {
    return api.sendMessage(`There is error. Please try again after ...`, event.threadID);
  }
}