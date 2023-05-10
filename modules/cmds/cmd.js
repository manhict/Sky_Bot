'use strict';
export const config = {
    name: 'cmd',
    version: '1.0.0',
    role: 2,
    author: ['Sky'],
    category: ['Hệ thống', 'System'],
    viDesc: 'Quản lý / Vận hành các lệnh tập lệnh bot',
    enDesc: 'Manage / Operate bot command',
    usage: '',
    timestamp: 1
};

import { createReadStream, statSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
import { createRequire } from "module"
const require = createRequire(import.meta.url)

export async function onMessage({ event, api, Config, logger, Threads, Users, args }) {
  const { threadID, messageID } = event;
  switch (args[0]) {
    case "load":
    case "-l":
    case "l":
        {
            if (!args[1]) {
                var success = [];
                var error = [];
                const commandFile = readdirSync(process.cwd() + '/modules/cmds/').filter(item => item.endsWith(".js") && !item.includes("example"));
                for (var file of commandFile) {
                    var command = await import('./' + file);
                    var nameCmd = command.config.name;
                    try {
                        delete require.cache[require.resolve(process.cwd() + '/modules/cmds/'+ file)];
                        global.client.cmds.splice(global.client.cmds.findIndex(i => i.config.name == nameCmd), 1);
                        if (!global.client.cmds.some(i => i.config.name == nameCmd)) {
                            global.client.cmds.push(command);
                            if (command.onLoad) {
                                command.onLoad({ Config, logger, Threads, Users });
                            }
                            success.push(command);
                        }
                    } catch (err) {
                        error.push({ name: nameCmd, error: err.stack });
                    }
                }
                if (error.length != 0) {
                    var msg = '';
                    var dem = 0;
                    for (var i of error) {
                        dem++;
                        msg += dem + '. ' + i.name + ': ' + i.error + '\n';
                    }
                    return api.sendMessage('〉Load success ' + success.length + ' command.\n» Have ' + error.length + ' error command «\n' + msg, threadID, messageID);
                } else {
                    return api.sendMessage('〉Load success ' + success.length + ' command.', threadID, messageID);
                }
            } else {
                try {
                    var command = await import('./' + args[1] + '.js');
                    var nameCmd = command.config.name;
                    delete require.cache[require.resolve(process.cwd() + '/modules/cmds/'+ args[1])];
                    global.client.cmds.splice(global.client.cmds.findIndex(i => i.config.name == nameCmd), 1);
                    if (!global.client.cmds.some(i => i.config.name == nameCmd)) {
                        global.client.cmds.push(command);
                        if (command.onLoad) {
                            command.onLoad({ Config, logger, Threads, Users });
                        }
                        return api.sendMessage('〉Load command `' + args[1] + '` success.', threadID, messageID);
                    }
                } catch (err) {
                    return api.sendMessage('Error loading command: `' + args[1] + '`.\n' + 'Error: Cannot find module.', threadID, messageID);
                }
            }
        }
    case "unload":
    case "-ul":
    case "ul":
        {
            if (!args[1]) {
                var success = [];
                const commandFile = readdirSync(process.cwd() + '/modules/cmds/').filter(item => item.endsWith(".js") && !item.includes("example") && !item.includes(this.config.name));
                for (var file of commandFile) {
                    var command = await import('./' + file);
                    var nameCmd = command.config.name;
                    delete require.cache[require.resolve(process.cwd() + '/modules/cmds/'+ file)];
                    global.client.cmds.splice(global.client.cmds.findIndex(i => i.config.name == nameCmd), 1);
                    if (!global.client.cmds.some(i => i.config.name == nameCmd)) {
                        success.push(command);
                    }
                }
                return api.sendMessage('〉Unload ' + success.length + ' command success.', threadID, messageID);
            } else {
                try {
                    var command = await import('./' + args[1] + '.js');
                    var nameCmd = command.config.name;
                    delete require.cache[require.resolve(process.cwd() + '/modules/cmds/'+ args[1])];
                    global.client.cmds.splice(global.client.cmds.findIndex(i => i.config.name == nameCmd), 1);
                    if (!global.client.cmds.some(i => i.config.name == nameCmd)) {
                        return api.sendMessage('〉Unload command `' + args[1] + '` success.', threadID, messageID);
                    }
                } catch (err) {
                    return api.sendMessage('〉Error unloading command: `' + args[1] + '`.\n' + 'Error: Cannot find module.', threadID, messageID);
                }
            }
        }
    case "count":
    case "-c":
        {
            return api.sendMessage('Show at there ' + global.client.cmds.length + ' command is running on this bot.', threadID, messageID);
        }
    default:
        {
            return client.throwError(this.config.name)
        }
    }
}