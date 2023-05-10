'use strict';

import axios from 'axios';
import fs from 'fs';

export const config = {
  name: 'zmp3',
  version: '1.0.0',
  role: 0,
  author: ['ManhG'],
  viDesc: 'Phát video thông qua link zingmp3 hoặc từ khoá tìm kiếm.',
  enDesc: 'Play video from zingmp3 or search by keyword.',
  category: ['Giải trí', 'Media'],
  usages: '',
  timestamp: 5
};

export async function onReply({ event, api, reply }) {
  api.sendMessage("Đang xử lý request của bạn!", event.threadID, (err, info) =>
    setTimeout(() => { api.unsendMessage(info.messageID) }, 10000));
  try {
    var getms = (await axios.get(`http://api.mp3.zing.vn/api/streaming/audio/${reply.link[event.body - 1]}/320`, { responseType: "arraybuffer" })).data;
    var shortLink = await require("tinyurl").shorten(`http://api.mp3.zing.vn/api/streaming/audio/${reply.link[event.body - 1]}/320`);
    fs.writeFileSync(process.cwd() + `/caches/${reply.link[event.body - 1]}.mp3`, Buffer.from(getms, "utf-8"));
    if (fs.statSync(process.cwd() + `/caches/${reply.link[event.body - 1]}.mp3`).size > 26214400) return api.sendMessage('Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => fs.unlinkSync(process.cwd() + `/caches/${reply.link[event.body - 1]}.mp3`), event.messageID);
    else api.sendMessage({ body: `Link Tải: ${shortLink}`, attachment: fs.createReadStream(process.cwd() + `/caches/${reply.link[event.body - 1]}.mp3`) }, event.threadID, () => fs.unlinkSync(process.cwd() + `/caches/${reply.link[event.body - 1]}.mp3`), event.messageID);
  }
  catch {
    api.sendMessage("Không thể xử lý yêu cầu của bạn!", event.threadID, event.messageID);
  }
  return api.unsendMessage(reply.messageID);
}

export async function onMessage({ event, api, args }) {
  if (args.length == 0 || !args) return api.sendMessage('Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
  const keywordSearch = args.join(" ");
  try {
    var getms = (await axios.get(`http://ac.mp3.zing.vn/complete?type=artist,song,key,code&num=500&query=${encodeURIComponent(keywordSearch)}`)).data;
    var retrieve = getms.data[0], msg = '', num = 0, link = [];
    for (var i = 0; i < 10; i++) {
      if (typeof retrieve.song[i].id != 'undefined') {
        msg += `${num += 1}. Tên Bài hát : ${decodeURIComponent(retrieve.song[i].name)}\nCa Sĩ : ${retrieve.song[i].artist}\n◆━━━━━━━━━◆\n`;
        link.push(retrieve.song[i].id);
      }
    }
    return api.sendMessage(`🔊 Có ${link.length} kết quả trùng với từ khoá tìm kiếm của bạn:\n\n${msg}\nHãy reply(phản hồi) chọn một trong những tìm kiếm trên`, event.threadID, (error, info) => client.reply.push({ name: this.config.name, messageID: info.messageID, author: event.senderID, link }), event.messageID);
  }
  catch {
    api.sendMessage(`Không tìm thấy từ khoá khớp với:\n ►►►${keywordSearch}\n👉Xin thử lại với kết quả khác!`, event.threadID, event.messageID);
  }
}