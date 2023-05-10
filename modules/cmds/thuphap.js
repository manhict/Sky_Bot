export const config = {
    name: 'thuphap',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Biểu ngữ tương tự tạo ra những bức ảnh đẹp.',
    enDesc: 'Create a bunch of images.',
    category: ["Edit Card", "Edit Card"],
    usages: "",
    timestamp: 5
}

import fs from 'fs'
import request from 'request'

var __dirname = process.cwd() + '/modules/cmds';
export async function onMessage({ Config, args, message }) {
    const webApi = Config['WEBAPI'];
    const apikey = Config['manhG'];

    function number(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 1 || x > 3);
    }
    var argsRegex = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
    var msg = 'Vui lòng nhập đúng định dạng [id | line | text1 | text2 | text3]!';
    try {
        let text = args.join(" ")
        if (!text) return message.reply(msg)
        const length_0 = parseInt(text.length)
        const text1 = argsRegex[0];
        console.log(text1)
        if (!text1) return message.reply(msg)
        const text2 = argsRegex[1];
        if (!text2) return message.reply(msg)
        const text3 = argsRegex[2];
        if (!text3) return message.reply(msg)
        const text4 = argsRegex[3];
        if (!text4) return message.reply(msg)
        const text5 = argsRegex[4];
        if (!text5) return message.reply(msg)
        var callback = () => message.reply({ body: ``, attachment: fs.createReadStream(process.cwd() + "/caches/thuphapnew.png") }, () => fs.unlinkSync(process.cwd() + "/caches/thuphapnew.png"));
        return request(encodeURI(`${webApi}/thuphap?id=${text1}&sodong=${text2}&dong_1=${text3}&dong_2=${text4}&dong_3=${text5}&apikey=${apikey}`)).pipe(fs.createWriteStream(process.cwd() + '/caches/thuphapnew.png')).on('close', () => callback());
    } catch (err) {
        console.log(err.stack)
        return message.reply(err.stack);
    }
}