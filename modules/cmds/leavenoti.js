'use strict';
export const config = {
    name: 'leavenoti',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Bật hoặc tắt gửi nhắn tạm biệt khi có thành viên out hoặc bị kick khỏi nhóm bạn.',
    enDesc: 'Turn on or off sending goodbye messages when a member leaves or is kicked out of your group.',
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

export async function onMessage({ event, api, Config, message, Threads, Users, args, getText  }) {
    const { threadID } = event;
    const data = (await Threads.getData(threadID)).data;

    if (!data.sendLeaveMessage) {
        data.sendLeaveMessage = true;
        await Threads.setData(threadID, { data: data });
    }

    if (args[0] == "on") data.sendLeaveMessage = true;
    else if (args[0] == "off") data.sendLeaveMessage = false;
    else return message.reply(`HD:\n 1. leavenoti on -> Bật tạm biệt thành viên\n2. leavenoti off -> Tắt tạm biệt thành viên`);

    await Threads.setData(threadID, {
        data
    }, (err, info) => {
        if (err) return message.reply(`Đã xảy ra lỗi, vui lòng thử lại sau`);
        message.reply(`Đã ${data.sendLeaveMessage ? "bật" : "tắt"} gửi tin nhắn tạm biệt khi có thành viên out hoặc bị kick khỏi nhóm bạn`);
    });
}