'use strict';
export const config = {
  name: 'checklive',
  version: '1.0.0',
  role: 0,
  author: ['ManhG'],
  viDesc: 'Check live AcessToken, Cookies Facebook.',
  enDesc: 'Check live AcessToken, Cookies Facebook.',
  category: ['Tiện ích', 'Utility'],
  usage: '',
  timestamp: 5
};

import axios from 'axios';

export const languages = {
  "vi_VN": {
    "liveToken": "〉AcessToken còn hiệu lực",
    "liveCookie": "〉Cookie còn hiệu lực",
    "dieToken": "〉Token đã hết hạn",
    "dieCookie": "〉Cookie đã hết hạn",
    "content": "〉Nhập token, cookie của bạn.",
    "error": "〉Lỗi, vui lòng thử lại sau"
  },
  "en_US": {
    "liveToken": " 〉Token, Cookie is still valid",
    "liveCookie": " 〉Cookie is still valid",
    "dieToken": "〉Token, Cookie has expired",
    "dieCookie": "〉Cookie has expired",
    "content": " 〉Enter your token, cookie.",
    "error": "〉Error, please try again later"
  }
}

export async function onMessage({ message, args, body, Threads, getText }) {
  const prefix = (await Threads.getData(message.threadID)).prefix || client.config.PREFIX;
  const cmd = config.name;
  if (!args[0] || !body) return message.reply(getText('content'));
  try {
    if (args[0].includes('EAA')) {
      var tokenFullPermission = args[0];
      const response = await axios({
        url: 'https://graph.facebook.com/app',
        method: "GET",
        params: {
          access_token: tokenFullPermission
        }
      });
      if (response.data.error) {
        return message.send(getText('dieToken'));
      }
      else return message.send(getText('liveToken'));
    }
    else if (body && body.includes('c_user')) {
      var cookie = body.replace(prefix + cmd, '');
      const response = await axios({
        url: 'https://mbasic.facebook.com/settings',
        method: "GET",
        headers: {
          cookie,
          'user-agent': 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36'
        }
      });
      const data = response.data.includes('/privacy/xcs/action/logging/') || response.data.includes('/notifications.php?');
      if (data) return message.send(getText('liveCookie'));
      else return message.send(getText('dieCookie'));
    }
    else return message.send(getText('error'));
  } catch (error) {
    message.send(getText('error'));
  }
}