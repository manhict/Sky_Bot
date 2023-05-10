'use strict';

export const config = {
    name: 'threadUpdate',
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Thông báo cập nhật nhóm',
    eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-icon", "log:thread-color"]
};

export const languages = {
    "vi_VN": {
        "updateAdminToQtv": "===『 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 』===\n\nĐã cập nhật %1 trở thành quản trị viên nhóm",
        "updateAdminToTv": "===『 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 』===\n\nĐã cập nhật %1 trở thành người dùng",
        "updateName": "===『 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 』===\n\nĐã cập nhật tên nhóm thành %1",
        "updateIcon": "===『 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 』===\n\nĐã cập nhật icon nhóm thành %1",
        "updateNickName": "===『 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 』===\n\n╰❥Name: %1\n☃Action: Cập nhật nickname\n\n%2 ⇨ %3"
    },
    "en_US": {
        "updateAdminToQtv": "===『 Notify 』===\n\nUpdated %1 to be group admin",
        "updateAdminToTv": "===『 Notify 』===\n\nUpdated %1 as a user",
        "updateName": "===『 Notify 』===\n\nUpdated group name to %1",
        "updateIcon": "===『 Notify 』===\n\nUpdated group icon to %1",
        "updateNickName": "===『 Notify 』===\n\n╰❥Name: %1\n☃Action: Update nickname\n\n%2 ⇨ %3"
    }
}

export async function onMessage({ event, api, Config, message, Threads, Users, getText }) {
    const { threadID, logMessageType, logMessageData } = event;
    let dataThread = await Threads.getData(threadID) || {};
    if(dataThread && dataThread["data"] && dataThread["data"]["threadUpdate"] != true) return;
    switch (logMessageType) {
        case "log:thread-admins": {
            if (logMessageData.TARGET_ID == undefined) return;
            if (logMessageData.ADMIN_EVENT == "add_admin") {
                dataThread.adminIDs.push(logMessageData.TARGET_ID)
                const name = await Users.getName(logMessageData.TARGET_ID)

                api.sendMessage(getText("updateAdminToQtv", name), threadID, (error, info) => {
                    setTimeout(function () {
                        return api.unsendMessage(info.messageID)
                    }, 10 * 1000);
                })

            } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                dataThread.adminIDs = dataThread.adminIDs.filter(item => item != logMessageData.TARGET_ID);
                const name = await Users.getName(logMessageData.TARGET_ID);

                api.sendMessage(getText("updateAdminToTv", name), threadID, (error, info) => {
                    setTimeout(function () {
                        return api.unsendMessage(info.messageID)
                    }, 10 * 1000);
                })

            }
            break;
        }
        case "log:thread-name": {
            let newName = event.logMessageData.name || "Noname";
            api.sendMessage(getText('updateName', newName), threadID, (error, info) => {
                setTimeout(function () {
                    return api.unsendMessage(info.messageID)
                }, 10 * 1000);
            })
            break;
        }
        case "log:thread-icon": {
            let icon = event.logMessageData.thread_icon;
            api.sendMessage(getText('updateIcon', icon), threadID, (error, info) => {
                setTimeout(function () {
                    return api.unsendMessage(info.messageID)
                }, 10 * 1000);
            })
            await Threads.setData(threadID, { emoji: icon })
            break;
        }
        case "log:user-nickname": {
            let newNickName = event.logMessageData.nickname || "NoNickName";
            let participant_id = event.logMessageData.participant_id;
            let dataUT = await Threads.getUser(threadID, participant_id) || {};
            let oldNickname = dataUT ? dataUT.nickname : null;
            let nameUser = dataUT ? dataUT.name : 'NoName';
            if (!oldNickname) return;
            api.sendMessage(getText("updateNickName", nameUser, oldNickname, newNickName), threadID, (error, info) => {
                setTimeout(function () {
                    api.unsendMessage(info.messageID)
                }, 10 * 1000);
            });
            await Threads.setUser(threadID, participant_id, { nickname: newNickName });
            break;
        }
    }
}
