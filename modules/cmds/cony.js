'use strict';
export const config = {
  name: 'cony',
  version: '1.0.0',
  role: 0,
  author: ['ManhG'],
  viDesc: 'Dự đoán tỉ lệ có Ny của bạn trong năm nay.',
  enDesc: 'Cony is a bot that predicts the chance of having a love interest in the year.',
  category: ['Tình yêu', 'Love'],
  usage: '',
  timestamp: 5
};

import fs from 'fs';
import axios from 'axios';
var pathCony = process.cwd() + "/caches/cony.gif";

export async function onMessage({ event, api, Users }) {
  var tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%", `1%`, `10%`, `99,9%`];
  var tle = tl[Math.floor(Math.random() * tl.length)];
  let name = (await Users.getData(event.senderID)).name;
  let img = (await axios.get('https://manhkhac.github.io/data/gif/dethuong.gif', {
    responseType: "arraybuffer"
  })).data;
  fs.writeFileSync(pathCony, Buffer.from(img, "utf-8"));
  var reply = {
    body: `Chúc mừng bạn ${name}.\nBot đã dự đoán tỉ lệ có người yêu của bạn trong năm nay là ${tle} ❤❤`,
    attachment: fs.createReadStream(pathCony)
  }
  await api.sendMessage(reply, event.threadID);
  return fs.unlinkSync(pathCony);
}