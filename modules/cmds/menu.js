'use strict';
export const config = {
    name: 'menu',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Danh sách lệnh.',
    enDesc: 'List of commands.',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 1
}

export const languages = {
    "vi_VN": {
        "msgListCmd": "✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n[ 'Sử dụng: %1help từng lệnh ở trên' để xem chi tiết cách sử dụng! | Hiện tại đang có %2 lệnh có thể sử dụng trên bot này ]",
        "moduleInfo": "「 %1 」\n%2\n\n❯ Cách sử dụng: %3\n❯ Thuộc nhóm: %4\n❯ Thời gian chờ: %5 giây(s)\n❯ Quyền hạn: %6\n\n» Module code by %7 «",
        "helpList": '[ Hiện tại đang có %1 lệnh có thể sử dụng trên bot này, Sử dụng: "%2help nameCommand" để xem chi tiết cách sử dụng! ]"',
        "user": "Người dùng",
        "adminGroup": "Quản trị viên nhóm",
        "adminBot": "Quản trị viên bot"
    },
    "en_US": {
        "msgListCmd": "✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n['Use: %1help per command on' to view by use! | Show at is in the %2 command may be used on this bot]",
        "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
        "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
        "user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot"
    }
}

export async function onMessage({ api, event, args, Threads, getText }) {
    try {
        const { threadID } = event;
        const dataThread = await Threads.getData(threadID) || {};
        const command = client.cmds.some(i => i.config.name == args[0]);
        const prefix = dataThread.prefix || client.config.PREFIX;
        const langData = dataThread.language || client.config.LANGUAGE_SYS;

        if (!command) {
            const commands = client.cmds;
            var group = [],
                msg = "",
                category;
            for (const commandConfig of commands) {
                // var role = (commandConfig.config.role == 0) ? client.getText('ROLE_0') : (commandConfig.config.role == 1) ? client.getText('ROLE_1') : (commandConfig.config.role == 2) ? client.getText('ROLE_2') : (commandConfig.config.role == 3) ? client.getText('ROLE_3') : client.getText('ROLE_4');
                // if (!group.some(item => item.group.toLowerCase() == role.toLowerCase())) group.push({ group: role.toLowerCase(), cmds: [commandConfig.config.name] });
                if(langData == 'vi_VN') commandConfig.config.category ? category = commandConfig.config.category[0] : category = 'Không có nhóm';
                else if(langData == 'en_US') commandConfig.config.category ? category = commandConfig.config.category[1] : category = 'No Category';
                else category = 'No Category';
                if (!group.some(item => item.group.toLowerCase() == category.toLowerCase())) group.push({ group: category.toLowerCase(), cmds: [commandConfig.config.name] });
                else group.find(item => item.group.toLowerCase() == category.toLowerCase()).cmds.push(commandConfig.config.name);
            }
            group.forEach(commandGroup => msg += `🍄➻❥ ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} \n${commandGroup.cmds.join(', ')}\n\n`);
            return api.sendMessage(msg + getText('msgListCmd', prefix, commands.length), threadID, async (error, info) => {
                if (true) {
                    await new Promise(resolve => setTimeout(resolve, 55 * 1000));
                    if (info) api.unsendMessage(info.messageID);
                    return;
                } else return;
            });
        }
    }
    catch (err) {
        console.error(err);
        api.sendMessage(err.message, event.threadID)
    }
}
