'use strict';
export const config = {
    name: 'vnex',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Báo vnex!.',
    enDesc: "Vnex news.",
    category: ['Tin tức', 'Social'],
    usages: '',
    timestamp: 5
}

import cheerio from 'cheerio';
import request from 'request';

export function onMessage({ api, event, args }) {
  var chovui = request.get('https://vnexpress.net/tin-tuc-24h', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var thoigian = $('.time-count');
      var tieude = $('.thumb-art');
      var noidung = $('.description');
      var time = thoigian.find('span').attr('datetime');
      var title = tieude.find('a').attr('title');
      var des = noidung.find('a').text();
      var link = noidung.find('a').attr('href');
      var description = des.split('.');

      return api.sendMessage(`Tin tức mới nhất\r\nThời gian đăng: ${time}\r\nTiêu đề: ${title}\r\n\nNội dung: ${description[0]}\r\nLiên kết: ${link}\r\n\n`, event.threadID, event.messageID)
    }
  })
}