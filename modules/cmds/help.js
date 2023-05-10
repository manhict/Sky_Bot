'use strict';

export const config = {
    name: 'help',
    version: '1.0.0',
    role: '0',
    author: ['Sky'],
    category: ['Hệ thống', 'System'],
    viDesc: 'Danh sách lệnh hiện có.',
    enDesc: 'List command',
    usage: '',
    timestamp: 1,
    envConfig: {
        "autoUnsend": true,
        "delayUnsend": 55
    }
};
export const languages = {
    "vi_VN": {
        "listcmd": "=== DANH SÁCH LỆNH ===\n\n",
        "msgListCmd": "✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n» Hiện đang có '%1' lệnh đang được chạy trên bot này",
        "numberpage": "\n» Trang (%1/%2). Dùng %3help [số trang/all] để xem các trang khác",
        "senMsg": "%1\n» Mô tả: %2\n» Quyền hạn: %3\n\n",
        "senMsgNoPage": "» Không có trang '%1'\n» hiện tại có '%2' trang.\n» Dùng %3help <số trang>"
    },
    "en_US": {
        "listcmd": "=== COMMAND LIST ===\n\n",
        "msgListCmd": "✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n» There is currently '%1' command running on this bot",
        "numberpage": "\n» Pages (%1/%2). Use %3help [page number/all] to view other pages",
        "senMsg": "%1\n» Description: %2\n» Permissions: %3\n\n",
        "senMsgNoPage": "» No page '%1'\n» currently has %2 page.\n» Use %3help <page number>"
    }
}
export async function onMessage({ event, api, message, args, Config, Threads, getText }) {
    const { threadID } = event;
    const prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];
    var getTxSys = (await Threads.getData(threadID)).language || Config['LANGUAGE_SYS']
    var command = global.client.cmds.some(i => i.config.name == args[0]);
    const { autoUnsend, delayUnsend } = client.envConfig.envCommands[this.config.name];
    if (args[0] == 'all') {
        var list = global.client.cmds;
        var page = 1;
        page = parseInt(args[1]) || 1;
        page < -1 ? page = 1 : "";
        var limit = 9999999999999;
        var msg = getText("listcmd");
        var numPage = Math.ceil(list.length / limit);
        if (page > numPage) return message.reply(client.thowError(this.config.name));
        for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
            if (i >= list.length) break;
            msg += `『${i + 1}』 - ${list[i].config.name}\n`;
        }
        msg += getText("msgListCmd", list.length);
        message.reply(msg, async(error, info) => {
            if (autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
                api.unsendMessage(info.messageID);
                return;
            } else return;
        });
        return;
    }
    if (!command) {
        var list = global.client.cmds;
        var page = 1;
        page = parseInt(args[0]) || 1;
        page < -1 ? page = 1 : "";
        var limit = 15;
        var msg = getText("listcmd");
        // console.log(msg);
        var numPage = Math.ceil(list.length / limit);

        if (page > numPage) return message.reply(getText("senMsgNoPage", page, numPage, prefix));
        for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
            if (i >= list.length) break;
            var command_1 = list[i];
            var role = await (command_1.config.role == 0) ? client.getText('ROLE_0') : (command_1.config.role == 1) ? client.getText('ROLE_1') : (command_1.config.role == 2) ? client.getText('ROLE_2') : (command_1.config.role == 3) ? client.getText('ROLE_3') : client.getText('ROLE_4');
            var description = list[i].config.viDesc || '';
            var enDesc = list[i].config.enDesc || '';
            var desc = (getTxSys == 'vi_VN') ? description : enDesc;
            var namecmd = `『${i + 1}』 - ${list[i].config.name}`;
            msg += getText("senMsg", namecmd, desc, role);
        }
        msg += getText("msgListCmd", list.length);
        msg += getText("numberpage", page, numPage, prefix);
        message.reply(msg, async(error, info) => {
            if (autoUnsend && !error) {
                await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
                api.unsendMessage(info.messageID);
                return;
            } else return;
        });
        return;
    } else {
       try{
        var command_1 = global.client.cmds.find(i => i.config.name == args.join(" "));
        var name = command_1.config.name.toUpperCase();
        var version = command_1.config.version || '';
        var role = await (command_1.config.role == 0) ? client.getText('ROLE_0') : (command_1.config.role == 1) ? client.getText('ROLE_1') : (command_1.config.role == 2) ? client.getText('ROLE_2') : (command_1.config.role == 3) ? client.getText('ROLE_3') : client.getText('ROLE_4');
        var author = (command_1.config.author.length > 1) ? command_1.config.author.join(", ") : command_1.config.author[0] || command_1.config.author;
        var description = command_1.config.viDesc || '';
        var enDesc = command_1.config.enDesc || '';
        var usages = command_1.config.usages ? (prefix + args.join(' ')) +' '+ command_1.config.usages : prefix + args.join(' ');
        //var category = (command_1.config.category.length > 1) ? command_1.config.category.join(", ") : command_1.config.category[0] || command_1.config.category || '';
        let timestamp = command_1.config.timestamp || 0;
        let desc = (getTxSys == 'vi_VN') ? description : enDesc;
        message.reply(client.getText("HELP", name, version, role, author, desc, timestamp, usages));
      }
      catch(err){
        console.log(err.stack || err)
        return message.send(err.message || err.stack)
     }
   }
}
