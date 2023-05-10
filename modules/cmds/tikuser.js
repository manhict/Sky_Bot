'use strict';
export const config = {
    name: 'tikuser',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Lấy thông tim người dùng tiktok.',
    enDesc: 'Get user information tiktok.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 0
};

import axios from 'axios';
import request from 'request';
import fs from 'fs';

var url_api = `https://nguyenmanh.name.vn/api/tikInfo?query=`;
var path = process.cwd() + '/caches/+' + Date.now() + '_tikuser.png';
export async function onMessage({ message, args, event }) {
    const apikey = client.config.APIKEY;
    const { senderID } = event;
    if (!args[0]) return message.reply('Nhập username người dùng');
    var query = args.join(" ");
    const {data} = await axios.get(url_api + encodeURI(query)+ '&apikey='+ apikey);
    if (data.status != 200) return message.reply(data.message)
    const { nickname, verified, uniqueId, avatar, signature, privateAccount } = data.result;
    const { followerCount, followingCount, heart, diggCount, videoCount } = data.result;
    var dataJson = `===「USER TIKTOK」===` +
        `\n\n🤓 Tên: ${nickname}` +
        `\n🔖 ID: ${uniqueId}` +
        `\n🐥 Link: https://tiktok.com/@${uniqueId}` +
        `\n${privateAccount ? "🔒 Tài khoản riêng tư: có" : "🔓 Tài khoản riêng tư: không"}` +
        `\n👀 Người theo dõi: ${followerCount}` +
        `\n♻️ Đang theo dõi: ${followingCount}` +
        `\n💗 Lượt tim: ${heart}` +
        `\n💞 Đã thả tim: ${diggCount} video` +
        `\n📤 Video đã đăng: ${videoCount}` +
        `\n📝 Tiểu sử: ${signature}` +
        `\n✅ Tích xanh: ${verified ? "có" : "không"}`;
    var callback = () => message.reply({
            body: dataJson,
            attachment: fs.createReadStream(path)
        },
        () => fs.unlinkSync(path));
    request(encodeURI(`${avatar}`)).pipe(fs.createWriteStream(path)).on('close', () => callback());
    return;
}