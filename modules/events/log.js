'use strict';
export const config = {
    name: 'log',
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Ghi lại thông báo các hoạt đông của bot!',
    eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"]
};
export async function onMessage({ event, api, Config, Threads, Users }) {
    if (Config['LOGBOT'] != true) return;
    const { threadID, senderID, author } = event;
    const time = global.utils.getTimeZone();
    let botID = api.getCurrentUserID();
    const nameThread = await Threads.getName(threadID) || "Noname";
    const nameUser = await Users.getName(author) || await Users.getName(senderID) || "Noname";

    var formReport = "==『 " + threadID + " 』==" +
        "\n\n╰❥Box: " + nameThread +
        "\n❤Name: " + nameUser +
        "\n☞UserID: " + author +
        "\n\n☃Action: {task}" +
        "\n\n⏱Time: " + time + "",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name":
            {
                const newName = event.logMessageData.name || "Noname";
                task = "Người dùng thay đổi tên nhóm thành: " + newName + "";
                // task = event.logMessageBody;
                await Threads.setName(threadID, newName);
                break;
            }
        case "log:subscribe":
            {
                let subscribe = event.logMessageData.addedParticipants;
                if (subscribe && subscribe.some(i => i.userFbId == botID)) {
                    task = "Người dùng đã thêm bot vào một nhóm mới!";
                    await Threads.setData(threadID, { status: true });
                }
                break;
            }
        case "log:unsubscribe":
            {
                if (event.logMessageData.leftParticipantFbId == botID) {
                    task = "Người dùng đã kick bot ra khỏi nhóm!";
                    await Threads.setData(threadID, { status: false });
                }
                break;
            }
        default:
            break;
    }

    if (task.length == 0) return;
    formReport = formReport
        .replace(/\{task}/g, task);

    var idad = Config['ADMIN'];
    for (let ad of idad) {
        api.sendMessage(formReport, ad, (error, info) => {
            if (info == undefined) {
                return console.error(error.errorSummary || error)
            }
        });
    }
}