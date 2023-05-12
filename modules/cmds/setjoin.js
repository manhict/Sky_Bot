'use strict';
export const config = {
    name: 'setjoin',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Chỉnh sửa nội dung tin nhắn chào mừng thành viên mới tham gia vào nhóm chat của bạn.',
    enDesc: 'Edit the content of the welcome message for new members joining your chat group.',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '',
    timestamp: 5
}

export const languages = {
    "vi_VN": {

    },
    "en_US": {

    }
}

import fs from "fs";

export async function onMessage({ api, event, args, Threads, getText }) {
    const { threadID } = event;
    const { data } = await Threads.getData(threadID);

    if (args[0] == "text") {
        if (!args[1]) return message.reply("Vui lùng nhập nội dung tin nhắn");
        else if (args[1] == "reset") data.welcomeMessage = null;
        else data.welcomeMessage = args.slice(1).join(" ");
    } else if (args[0] == "file") {
        if (args[1] == "reset") {
            try {
                fs.unlinkSync(__dirname + "/../events/src/mediaWelcome/" + data.welcomeAttachment);
            } catch (e) { }
            data.welcomeAttachment = null;
        } else if (!event.messageReply || event.messageReply.attachments.length == 0) return message.reply("Vui lòng reply (phản hồi) một tin nhắn có chứa file ảnh/video/audio");
        else {
            const attachments = event.messageReply.attachments;
            const typeFile = attachments[0].type;
            const ext = typeFile == "audio" ? ".mp3" :
                typeFile == "video" ? ".mp4" :
                    typeFile == "photo" ? ".png" :
                        typeFile == "animated_image" ? ".gif" : "";
            const fileName = "welcome" + threadID + ext;
            await download(attachments[0].url, __dirname + "/../events/src/mediaWelcome/" + fileName);
            data.welcomeAttachment = fileName;
        }
    } else return message.reply(`Use:\n1. 𝙨𝙚𝙩𝙟𝙤𝙞𝙣 text [<nội dung>|reset]: chỉnh sửa nội dung văn bản hoặc reset về mặc định, những shortcut có sẵn\n - Reply (phản hồi) một tin nhắn có file với nội dung '𝙨𝙚𝙩𝙟𝙤𝙞𝙣 file': để gửi file đó khi có thành viên mới (ảnh, video, audio)\n2. 𝙨𝙚𝙩𝙟𝙤𝙞𝙣 file reset: xóa gửi file\n3. Ví dụ:\n𝙨𝙚𝙩𝙟𝙤𝙞𝙣 text Hello {userName}, welcome to {boxName} Chúc {multiple} một ngày mới vui vẻ`);

    await Threads.saveData(threadID, {
        data
    }, (err, info) => {
        if (err) return message.reply(`Đã xảy ra lỗi, vui lòng thử lại sau`);
        message.reply(`Đã lưu thay đổi của bạn`);
    });
}