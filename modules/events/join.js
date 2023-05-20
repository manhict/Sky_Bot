'use strict';
export const config = {
    name: 'join',
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Thông báo người dùng vào nhóm.',
    enDesc: 'Notify users into groups.',
    eventType: ["log:subscribe"]
};
export const languages = {
    "vi_VN": {
        "botWecome": "🔱 Kết nối thành công với Sky𝗕𝗼𝘁 ✌️!\n\n🍓Sử dụng '%1help all' để xem tất cả các lệnh có trên bot này\n♻️Sử dụng: %2language vietnames/english để chọn ngôn ngữ cho nhóm trò chuyện của bạn\n\n🔷🎭Admin nhà điều hành bot: \nFb.com/support.manhict",
        "wecDefault": "👋Welcome {userName}.\nChào mừng {multiple} đã đến với: {boxName}\nLà thành viên thứ {member} của nhóm.\nChúc {multiple} có một buổi {session} vui vẻ =)",
        "friend": "bạn",
        "friends": "các bạn",
        "morning": "sáng",
        "noon": "trưa",
        "afternoon": "chiều",
        "night": "tối"
    },
    "en_US": {
        "botWecome": "🔱🪂Successfully connected with Sky𝗕𝗼𝘁 ✌️!\n\n🍓Use '%1help all' to see all commands present on this bot\n♻️Use: %2language vietnames/english to select the language for your chat group\n\n🔷🎭Admin bot operator:\nFb.com/support.manhict",
        "wecDefault": "👋Welcome {userName}.\nWelcome {multiple} to: {boxName}\nBe the {member} member of the group.\nWish {multiple} a happy {session} =)",
        "friend": "you",
        "friends": "friends",
        "morning": "morning",
        "noon": "noon",
        "afternoon": "afternoon",
        "night": "night"
    }
}
import * as fs from "fs"
import moment from "moment-timezone"
export async function onMessage({ event, api, Config, message, Threads, Users, getText }) {
    const { threadID } = event;
    const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    const getPrefix = (await Threads.getData(threadID).prefix) || Config['PREFIX'];
    // check data

    if (!global.data.allThreadID.find(e => e == threadID)) return;
    const dataThread = await Threads.getData(threadID);
    const threadData = dataThread.data || {};
    // if (threadData.sendWelcomeMessage != true) return;
    // Nếu là bot;
    
    if (event.logMessageData.addedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
        await Threads.setStatus(event.threadID, true);
        api.changeNickname(`〘 ${getPrefix} 〙➤ Sky❤️𝗕𝗼𝘁 ✌️`, threadID, api.getCurrentUserID());
        return message.send(getText("botWecome", getPrefix, getPrefix));
    }
    // Nếu là thành viên mới:
    
    const boxName = dataThread.name;
    var userName = [],
        mentions = [],
        memLength = [],
        i = 0;
    let participantIDs = (event.participantIDs).length;
    let multiple = false;
    const dataAddedParticipants = event.logMessageData.addedParticipants;
    if (dataAddedParticipants.length > 1) multiple = true;
    for (let user of dataAddedParticipants) {
        userName.push(user.fullName);
        memLength.push(participantIDs - i++);
        mentions.push({
            tag: user.fullName,
            id: user.userFbId
        });
    }
    memLength.sort((a, b) => a - b);
    // {userName}: tên của thành viên mới
    // {boxName}:  tên của nhóm chat
    // {multiple}: bạn || các bạn
    // {session}:  buổi trong ngày
    const messageWelcomeDefault = getText("wecDefault");
    let messageWelcome = threadData.welcomeMessage || messageWelcomeDefault;
    messageWelcome = messageWelcome
        .replace(/\{userName}/g, userName.join(", "))
        .replace(/\{boxName}/g, boxName)
        .replace(/\{member}/g, memLength.join(", "))
        .replace(/\{multiple}/g, multiple ? getText("friends") : getText("friend"))
        .replace(/\{session}/g, hours <= 10 ? getText("morning") :
            hours > 10 && hours <= 12 ? getText("noon") :
            hours > 12 && hours <= 18 ? getText("afternoon") : getText("night"));

    const form = {
        body: messageWelcome,
        mentions
    };
    await Threads.increaseMember(threadID, participantIDs);
    threadData.welcomeAttachment ? form.attachment = fs.createReadStream(process.cwd() + "/modules/events/src/mediaWelcome/" + threadData.welcomeAttachment) : "";

    message.send(form);
}
