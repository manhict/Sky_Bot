'use strict';
export const config = {
    name: 'leave',
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Thông báo rời nhóm',
    enDesc: 'Notice of leaving the group',
    eventType: ["log:unsubscribe"]
};
export const languages = {
    "vi_VN": {
        "messageLeave": "{userName} đã {type} khỏi nhóm",
        "leave": "tự rời",
        "kick": "quản trị viên sút bay màu",
        "morning": "sáng",
        "noon": "trưa",
        "afternoon": "chiều",
        "night": "tối"
    },
    "en_US": {
        "messageLeave": "{userName} {type} group",
        "leave": "leave",
        "kick": "colored flying stone admin",
        "morning": "morning",
        "noon": "noon",
        "afternoon": "afternoon",
        "night": "night"
    }
}
import * as fs from "fs"
import moment from "moment-timezone"
const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
export async function onMessage({ event, api, Config, message, Threads, Users, getText }) {
    const { threadID } = event;
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    if (!global.data.allThreadID.find(e => e == threadID)) return;
    const threadData = (await Threads.getData(threadID)).data || {};
    if (threadData.sendLeaveMessage != true) return;

    let leftParticipantFbId = event.logMessageData.leftParticipantFbId;
    const messageLeaveDefault = getText("messageLeave")
    let messageLeave = threadData ? threadData.leaveMessage || messageLeaveDefault : messageLeaveDefault;
    const userName = (await Users.getData(leftParticipantFbId)).name || leftParticipantFbId;
    // {userName}: tên của thành viên bị kick / tự out
    // {type}: tự rời/bị qtv kick
    // {session}: buổi tring ngày
    messageLeave = messageLeave
        .replace(/\{userName}/g, userName)
        .replace(/\{type}/g, leftParticipantFbId == event.author ? getText("leave") : getText("kick"))
        .replace(/\{session}/g, hours <= 10 ? getText("morning") :
            hours > 10 && hours <= 12 ? getText("noon") :
            hours > 12 && hours <= 18 ? getText("afternoon") : getText("night"));

    const form = {
        body: messageLeave,
        mentions: [{
            id: leftParticipantFbId,
            tag: userName
        }]
    };
    await Threads.decreaseMember(threadID);
    await Threads.setStatus(threadID, true);
    threadData.leaveAttachment ? form.attachment = fs.createReadStream(process.cwd() + "/modules/events/src/mediaLeave/" + threadData.leaveAttachment) : "";

    message.send(form);
}
