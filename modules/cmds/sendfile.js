export const config = {
    name: 'sendfile',
    role: 2,
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'sendfile',
    enDesc: 'sendfile',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0,
};

import fs from 'fs'
import stringSimilarity from 'string-similarity'

var __dirname = process.cwd() + '/modules/cmds';
export async function onMessage({ args, api, event, Users }) {
    const file = args.join(" ");
    if (!file) return api.sendMessage('Tên file không được bỏ trống', event.threadID, event.messageID);
    if (!file.endsWith('.js')) return api.sendMessage('Đuôi file không được khác .js', event.threadID, event.messageID);
    if (event.type == "message_reply") {
        var uid = event.messageReply.senderID
        var name = (await Users.getData(uid)).name;
        if (!fs.existsSync(process.cwd() + "/" + file)) {
            var moduleList = args.splice(1, args.length);
            moduleList = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js"))
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            var checker = stringSimilarity.findBestMatch(file, moduleList)
            if (checker.bestMatch.rating >= 0.5) var search = checker.bestMatch.target || "Ko có file nào gần giống";
            return api.sendMessage('🔎 Không tìm thấy file: ' + file + ' \n🔎 File gần giống là: ' + search + '.js, \n» Thả cảm xúc vào tin nhắn này để give nó.', event.threadID, (error, info) => {
                client.reaction.push({
                    type: 'user',
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    file: search,
                    uid: uid,
                    namee: name
                })
            }, event.messageID);
        }
        fs.copyFileSync(process.cwd() + '/' + file, process.cwd() + '/' + file.replace(".js", ".txt"));
        return api.sendMessage({
            body: '»  File ' + args.join(' ') + ' của bạn đây',
            attachment: fs.createReadStream(process.cwd() + '/' + file.replace('.js', '.txt'))
        }, uid, () => fs.unlinkSync(process.cwd() + '/' + file.replace('.js', '.txt'))).then(
            api.sendMessage('» Check tin nhắn đi ' + name, event.threadID, (error) => {
                if (error) return api.sendMessage('» Có lỗi khi gửi file đến ' + name, event.threadID, event.messageID);
            }, event.messageID));
    } else {
        if (!fs.existsSync(process.cwd() + "/" + file)) {
            var moduleList = args.splice(1, args.length);
            moduleList = fs.readdirSync(__dirname).filter((file) => file.endsWith(".js"))
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            var checker = stringSimilarity.findBestMatch(file, moduleList)
            if (checker.bestMatch.rating >= 0.5) var search = checker.bestMatch.target || "Ko tồn tại";
            return api.sendMessage('🔎 Không tìm thấy file: ' + file + ' \n🔎 File gần giống là: ' + search + '.js, \n» Thả cảm xúc vào tin nhắn này để give nó.', event.threadID, (error, info) => {
                client.reaction.push({
                    type: 'thread',
                    name: "sendfile",
                    author: event.senderID,
                    messageID: info.messageID,
                    file: search
                })
            }, event.messageID);
        }
        fs.copyFileSync(process.cwd() + '/' + file, process.cwd() + '/' + file.replace(".js", ".txt"));
        return api.sendMessage({
            body: '»  File ' + args.join(' ') + ' của bạn đây',
            attachment: fs.createReadStream(process.cwd() + '/' + file.replace('.js', '.txt'))
        }, event.threadID, () => fs.unlinkSync(process.cwd() + '/' + file.replace('.js', '.txt')), event.messageID);
    }
}
export async function onReaction({ Users, api, event, Config, reaction }) {
    var { file, author, type, uid, namee } = reaction;
    if (!author) return;
    var fileSend = file + '.js'
    switch (type) {
        case "user":
            {
                fs.copyFileSync(process.cwd() + '/' + fileSend, process.cwd() + '/' + fileSend.replace(".js", ".txt"));
                api.unsendMessage(reaction.messageID)
                return api.sendMessage({
                    body: '» File ' + file + ' của bạn đây',
                    attachment: fs.createReadStream(process.cwd() + '/' + fileSend.replace('.js', '.txt'))
                }, uid, () => fs.unlinkSync(process.cwd() + '/' + fileSend.replace('.js', '.txt'))).then(
                    api.sendMessage('» Check tin nhắn đi ' + namee, event.threadID, (error) => {
                        if (error) return api.sendMessage('» Có lỗi khi gửi file đến ' + namee, event.threadID, event.messageID);
                    }, event.messageID));;
            }
        case "thread":
            {
                fs.copyFileSync(process.cwd() + '/' + fileSend, process.cwd() + '/' + fileSend.replace(".js", ".txt"));
                api.unsendMessage(reaction.messageID)
                return api.sendMessage({
                    body: '» File ' + file + ' của bạn đây',
                    attachment: fs.createReadStream(process.cwd() + '/' + fileSend.replace('.js', '.txt'))
                }, event.threadID, () => fs.unlinkSync(process.cwd() + '/' + fileSend.replace('.js', '.txt')), event.messageID);
            }
    }
}