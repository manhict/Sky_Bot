'use strict';
export const config = {
    name: 'backupmongo',
    version: '1.0.0',
    role: 2,
    author: ['Sky'],
    viDesc: "Sao lưu lại dữ liệu trên mongodb về json",
    enDesc: 'Convert mongodb to json',
    category: ["Hệ thống", "System"],
    usages: "",
    timestamp: 5
};

import fs from 'fs';
import threadsModels from '../../src/database/models/threadsModel.js'
import usersModels from '../../src/database/models/usersModel.js'
const pathThreads = process.cwd() + "/caches/" + Date.now() + "_dataThreads.json";
const pathUsers = process.cwd() + "/caches/" + Date.now() + "_dataUsers.json";

export async function onMessage({ message, Config }) {
    if (Config.DATABASE.type != "mongodb") return message.send("Bạn phải sử dụng cơ sở dữ liệu mongdb mới có thể dùng lệnh này");
    
    const dataAllThreads = (await threadsModels.find({ type: "thread" }))[0].data || {};
    const dataAllUsers = (await usersModels.find({ type: "user" }))[0].data || {};

    fs.writeFileSync(pathThreads, JSON.stringify(dataAllThreads, null, 2));
    fs.writeFileSync(pathUsers, JSON.stringify(dataAllUsers, null, 2));

    const sendFile = [];
    sendFile.push(fs.createReadStream(pathThreads));
    sendFile.push(fs.createReadStream(pathUsers));
    message.reply({
        attachment: sendFile
    }, () => {
        fs.unlinkSync(pathThreads);
        fs.unlinkSync(pathUsers);
    });
};
