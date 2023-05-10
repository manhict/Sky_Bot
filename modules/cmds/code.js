'use strict';
export const config = {
    name: 'code',
    version: '1.0.0',
    role: 2,
    author: ['ManhG'],
    viDesc: 'Quản lý/chỉnh sửa lệnh bot [read/write/cre/edit/del/rename].',
    enDesc: 'Manage/edit commands [read/write/cre/edit/del/rename].',
    category: ['Hệ thống', 'System'],
    usage: '',
    timestamp: 0
}

import fs from 'fs'

var pathcmd = process.cwd() + '/modules/cmds'
export async function onMessage({ event, api, Config, args }) {
    if (args.length == 0) return api.sendMessage("Syntax error", event.threadID);
    if (args[0] == "edit") {
        var path = `${pathcmd}/${args[1]}.js`;
        if (!fs.existsSync(path)) {
            return api.sendMessage(`Found file ${args[1]}.js`, event.threadID, event.messageID)
        }
        var newCode = event.body.slice(
            args[2].length + args[2].length + args[1].length + args[0].length,
            event.body.length
        );
        //console.log(newCode);
        fs.writeFile(
            `${pathcmd}/${args[1]}.js`,
            newCode,
            "utf-8",
            function (err) {
                if (err)
                    return api.sendMessage(
                        `An error occurred while applying the new code to "${args[1]}.js".`
                    );
                api.sendMessage(
                    `New code applied for "${args[1]}.js".`,
                    event.threadID,
                    event.messageID
                );
            }
        );
    } else if (args[0] == "read") {
        var data = await fs.readFile(
            `${pathcmd}/${args[1]}.js`,
            "utf-8",
            (err, data) => {
                if (err)
                    return api.sendMessage(
                        `An error occurred while reading the command "${args[1]}.js".`,
                        event.threadID,
                        event.messageID
                    );
                api.sendMessage(data, event.threadID, event.messageID);
            }
        );
    } else if (args[0] == "cre") {
        if (args[1].length == 0) return api.sendMessage("Modules have not been named yet", event.threadID);
        if (fs.existsSync(`${pathcmd}/${args[1]}.js`))
            return api.sendMessage(
                `${args[1]}.js already exist.`,
                event.threadID,
                event.messageID
            );
        fs.copySync(pathcmd + "/example.js", pathcmd + "/" + args[1] + ".js");
        return api.sendMessage(
            `File has been created successfully "${args[1]}.js".`,
            event.threadID,
            event.messageID
        );
    } else if (args[0] == "copy") {
        if (args[1].length == 0) return api.sendMessage("args[1] not found", event.threadID);
        if (args[2].length == 0) return api.sendMessage("args[2] not found", event.threadID);
        var path = `${pathcmd}/${args[2]}.js`;
        if (!fs.existsSync(path)) {
            return api.sendMessage(`Found file ${args[2]}.js`, event.threadID, event.messageID)
        }
        if (fs.existsSync(`${pathcmd}/${args[1]}.js`))
            return api.sendMessage(
                `${args[1]}.js already exist.`,
                event.threadID,
                event.messageID
            );
        fs.copySync(pathcmd + "/" + args[2] + ".js", pathcmd + "/" + args[1] + ".js");
        return api.sendMessage(
            `File has been copy successfully "${args[1]}.js".`,
            event.threadID,
            event.messageID
        );
    } else if (args[0] == "del") {
        var path = `${pathcmd}/${args[1]}.js`;
        if (!fs.existsSync(path)) {
            return api.sendMessage(`Found file ${args[1]}.js`, event.threadID, event.messageID)
        } else {
            fs.unlink(path);
            return api.sendMessage(`Deleted file named "${args[1]}.js".`, event.threadID, event.messageID)
        }

    } else if (args[0] == "rename") {
        var path = `${pathcmd}/${args[1]}.js`;
        if (!fs.existsSync(path)) {
            return api.sendMessage(`Found file ${args[1]}.js`, event.threadID, event.messageID)
        } else
            fs.rename(path, `${pathcmd}/${args[2]}.js`, function (err) {
                if (err) throw err;
                return api.sendMessage(
                    `File has been renamed successfully "${args[1]}.js" to "${args[2]}.js".`,
                    event.threadID,
                    event.messageID)
            });
    } else return api.sendMessage(
        `Ex: Comming soon...`,
        event.threadID,
        event.messageID)
}