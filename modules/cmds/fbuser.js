'use strict';
export const config = {
    name: 'fbuser',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Xóa thành viên người dùng Facebook.',
    enDesc: 'Remove Facebook user.',
    category: ['Quản trị nhóm', 'Group management'],
    usage: '',
    timestamp: 0
};

export const languages = {
    "vi_VN":{
        "noFbUser": "〉Trong nhóm bạn không tồn tại 'Người dùng Facebook.",
        "countFbUser": "〉Nhóm bạn hiện có %1 Người dùng Facebook.",
        "noQTV": "〉Bot không phải là quản trị viên nhóm nên không thể lọc được.",
        "beginFbUser": "〉Bắt đầu lọc...",
        "successUser": "〉Đã lọc thành công %1 người.",
        "failUser": "〉Lọc thất bại %1 người."
    },
    "en_US":{
        "noFbUser": "〉There is no 'Facebook User' in your group.",
        "countFbUser": "〉Your group currently has %1 Facebook Users.",
        "noQTV": "〉Bot is not a group administrator so it cannot be filtered.",
        "beginFbUser": "〉Start filtering...",
        "successUser": "〉Successfully filtered %1 people.",
        "failUser": "〉Filter failed %1 person."
    }
}

export async function onMessage({ event, api, getText }) {
    var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);
    var success = 0,
        fail = 0;
    var arr = [];
    for (const e of userInfo) {
        if (e.gender == undefined) {
            arr.push(e.id);
        }
    };

    adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
    if (arr.length == 0) {
        return api.sendMessage(getText("noFbUser"), event.threadID);
    } else {
        api.sendMessage(getText("countFbUser", arr.length), event.threadID, function() {
            if (!adminIDs) {
                return api.sendMessage(getText("noQTV"), event.threadID);
            } else {
                api.sendMessage(getText("beginFbUser"), event.threadID, async function() {
                    for (const e of arr) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await api.removeUserFromGroup(parseInt(e), event.threadID);
                            success++;
                        } catch {
                            fail++;
                        }
                    }
                    return api.sendMessage(getText("successUser", success), event.threadID, function() {
                        if (fail != 0) return api.sendMessage(getText('fileUser', fail), event.threadID);
                    });
                })
            }
        })
    }
}
