'use strict';
export const config = {
    name: 'user',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Tìm kiếm/cấm/gỡ cấm người dùng.',
    enDesc: 'Search/ban/unban user.',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '[search/ban/unban] [id]',
    timestamp: 0
};

export async function onMessage({ event, api, message, Threads, args, Users, Config }) {
    const prefix = (await Threads.getData(event.threadID)).prefix || Config['PREFIX'];
    var guide = `
HƯỚNG DẪN:\n
${prefix}user [find | -f | search | -s] <tên cần tìm>: tìm kiếm người dùng trong dữ liệu bot bằng tên.\n
${prefix}user [ban | -b] [<id> | @tag | reply tin nhắn] <reason>: để cấm người dùng mang id <id> hoặc người được tag hoặc người gửi của tin nhắn được reply sử dụng bot.\n
${prefix}user unban [<id> | @tag | reply tin nhắn]: để bỏ cấm người dùng sử dụng bot.`;
    const type = args[0];
    if (type == "help") return message.send(guide);
    //---> Code <---//
    if (["find", "search", "-f", "-s"].includes(type)) {
        var allUser = await Users.getKey(["id", "name"]);
        var arrayreturn = [];
        var msg = "";
        var length = 0;
        const keyword = args[1];
        if (!keyword) return message.reply(`Nhập tên cần tìm kiếm`);
        for (let i in allUser) {
            if (allUser[i].name.toLowerCase().includes(keyword.toLowerCase())) {
                length++;
                msg += `\n╭Name: ${allUser[i].name}\n╰UID: ${allUser[i].id}\n`;
            }
        }
        return message.reply(length == 0 ? `❌Không có kết quả tìm kiếm nào phù hợp với từ khóa ${keyword}` : `🔎Có ${length} kết quả phù hợp cho từ khóa "${keyword}":\n${msg}`);
    } else if (["ban", "-b"].includes(type)) {
        let id, reason;
        if (event.type == "message_reply") {
            id = event.messageReply.senderID;
            reason = args.slice(1).join(" ");
        } else if (event.mentions) {
            if (!Object.keys(event.mentions)[0]) {
                id = args[1];
                reason = args.slice(2).join(" ");
            } else {
                id = Object.keys(event.mentions)[0];
                reason = args.slice(3).join(" ");
            }
        } else return;
        //console.log(id + " | ", reason)
        if (!id) return message.reply("ID của người cần ban không được để trống, vui lòng nhập id hoặc tag hoặc reply tin nhắn của 1 người theo cú pháp user ban <id> <lý do>");
        if (!reason) return message.reply("Lý do cấm người dùng không được để trống, vui lòng soạn tin nhắn theo cú pháp user ban <id> <lý do>");
        let dataUser = (await Users.getData(id.toString()));
        if (dataUser.id != id) return message.reply(`Người dùng mang ID: ${id} không tồn tại trong dữ liệu bot`);
        if (dataUser.banned.status == true) return message.reply(`Người dùng mang id ${id} đã bị cấm từ trước`);
        reason = reason.replace(/\s+/g, ' ');
        const name = dataUser.name;
        await Users.setBanned(id, reason)
        return message.reply(`Đã cấm người dùng mang ID: ${id} | ${name} sử dụng bot với lý do: ${reason}`);
    } else if (["unban", "-u"].includes(type)) {
        let id;
        if (event.type == "message_reply") {
            id = event.messageReply.senderID;
        } else if (event.mentions) {
            id = Object.keys(event.mentions)[0] || args[1];
        } else return;
        if (!id) return message.reply("ID của người cần ban không được để trống, vui lòng nhập id hoặc tag hoặc teply tin nhắn của 1 người theo cú pháp user ban <id> <lý do>");
        let dataUser = (await Users.getData(id.toString()));
        if (dataUser.id != id) return message.reply(`Người dùng mang ID: ${id} không tồn tại trong dữ liệu bot`);
        if (dataUser.banned.status != true) return message.reply(`Người dùng mang ID: ${id} không bị ban từ trước`);
        const name = dataUser.name;
        await Users.unBanned(id)
        message.reply(`Đã bỏ cấm người dùng mang id ${id} | ${name}, hiện tại người này có thể sử dụng bot`);
    } else message.reply(guide);
}