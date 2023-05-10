"use strict";

import { writeFileSync, readFileSync, readdirSync, existsSync } from 'fs'
import path, { join } from 'path'
import { execSync } from 'child_process'
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import threadsModels from '../database/models/threadsModel.js'
import usersModels from '../database/models/usersModel.js'
import login from '../database/controllers/login.js'

export async function cmds_events({ Config, logger, Threads, Users }) {
    const { envConfig } = global.client;
    const folder = ["cmds", "events"];

    for (const folderModules of folder) {
        const commandError = [], eventError = [], packageErr = [], nameCmdErr = [];
        let text = "", typeEnvCommand = "", setMap = "";
        if (folderModules == "cmds") {
            text = "command";
            typeEnvCommand = "envCommands";
            setMap = "cmds";
        }
        else {
            text = "event";
            typeEnvCommand = "envEvents";
            setMap = "events";
        }
        const Files = readdirSync(process.cwd() + "/modules/" + folderModules).filter((item) => item.endsWith(".js") && !item.includes("example"));
        for (const file of Files) {
            try {
                const pathCommand = process.cwd() + `/modules/${folderModules}/${file}`;
                const command = await import('../../' + `/modules/${folderModules}/${file}`);
                const configCommand = command.config;
                //_____________________CHECK SYNTAXERROR_____________________//
                const commandName = configCommand.name;
                if (!configCommand) throw new Error("Config of command undefined");
                if (!commandName) throw new Error(`Command name cannot be blank!`);
                //________________ CHECK ENV GLOBAL ___________________//
                if (configCommand.envGlobal) {
                    const { envGlobal } = configCommand;
                    if (typeof envGlobal != "object" && Array.isArray(envGlobal)) throw new Error("envGlobal need to be a object");
                    if (!envConfig.envGlobal) envConfig.envGlobal = {};
                    for (const i in envGlobal) {
                        if (!envConfig.envGlobal[i]) envConfig.envGlobal[i] = envGlobal[i];
                        else {
                            let readCommand = readFileSync(pathCommand).toString();
                            readCommand = readCommand.replace(envGlobal[i], envConfig.envGlobal[i]);
                            writeFileSync(pathCommand, readCommand);
                        }
                    }
                }
                // //_______________ CHECK CONFIG COMMAND _______________//
                if (configCommand.envConfig && typeof configCommand.envConfig == "object") {
                    if (!envConfig[typeEnvCommand]) envConfig[typeEnvCommand] = {};
                    if (!envConfig[typeEnvCommand][commandName]) envConfig[typeEnvCommand][commandName] = {};

                    for (const [key, value] of Object.entries(configCommand.envConfig)) {
                        if (!envConfig[typeEnvCommand][commandName][key]) envConfig[typeEnvCommand][commandName][key] = value;
                        else {
                            let readCommand = readFileSync(pathCommand).toString();
                            readCommand = readCommand.replace(value, envConfig[typeEnvCommand][commandName][key]);
                            writeFileSync(pathCommand, readCommand);
                        }
                    }
                }
                //___________ PUSH CMDS + EVENS NAME TO GLOBAL CONFIG _____________//
                if (global.client[folderModules].findIndex(i => i.config.name == commandName) < 0) {
                    if (command.onLoad) {
                        command.onLoad({ Config, logger, Threads, Users })
                    }
                    global.client[folderModules].push(command);
                }
                else {
                    logger.error('\x1b[1;93m[' + text.toUpperCase() + '\x1b[1;37m] ' + commandName + ' ' + global.getText('NAMESAKE'));
                }
            }
            catch (error) {
                commandError.push({ name: file, error });
            }
        }
        //___________________________ CHECK FILE ___________________________//
        if (commandError.length > 0) {
            for (const item of commandError) {
                const pk = item.error.message.split('\'')[1];
                if (pk && !['', ',', '.js', 'config', 'onMessage'].includes(pk)) {
                    packageErr.push({ pk, name: item.name });
                    nameCmdErr.push(item.name);
                } else
                    logger.error(global.getText('ERROR_LOAD_FILE', item.name, item.error.message), text);
            }
        }
        //_____________________ INSTALL PACKAGE _____________________//
        if (packageErr.length > 0) {
            function unique(arr) {
                return Array.from(new Set(arr)) //
            }
            var iArr = [];
            for (const iz in packageErr) {
                iArr.push(packageErr[iz].pk);
            }
            logger.log(global.getText('INSTALL_PACKAGE', nameCmdErr.join(', '), text), "INSTALL PACKAGE");
            for (const i of unique(iArr)) {
                try {
                    execSync("npm install " + i + " -s");
                    logger.log(global.getText('INSTALL_PACKAGE_SUCCESS', i), "PACKAGE");
                }
                catch (e) {
                    logger.error(global.getText('INSTALL_PACKAGE_FAILED', i, text, e.message), "INSTALL PACKAGE FAILED");
                }
            }
            process.exit(1);
            console.log('\x1b[1;37m');
        }
        //_______________________ COUNT CMDS + EVENS _______________________//
        if (global.client[folderModules].length > 0) {
            logger.log(global.getText('COMMAND_EVENT_LOAD_FILE', global.client[folderModules].length, text), folderModules);
        }
    }
};

export async function commands({ Config, logger, Threads, Users }) {
    const dirFile = path.join(client.dirMain + '/modules/' + 'cmds')
    const listFile = readdirSync(dirFile).filter(item => item.endsWith(".js") && !item.includes("example"));
    for (var file of listFile) {
        try {
            let command = await import('../../' + '/modules/' + 'cmds/' + file);
            const nameCmd = command.config.name;
            //_______________________ LOAD PUSH GLOBAL _______________________//
            if (global.client.cmds.findIndex(i => i.config.name == nameCmd) < 0) {
                if (command.onLoad) {
                    command.onLoad({ Config, logger, Threads, Users })
                }
                // if (!envConfig.envScripts.find(e => e.name == command.config.name)) {
                //     if (command.config.envConfig) {
                //         envConfig.envScripts.push({ name: command.config.name, configCommand: command.config.envConfig });
                //         writeFileSync(global.dirEnvConfig, JSON.stringify(envConfig, null, 4), "utf-8");
                //         logger.load(global.getText('ENVCONFIG_LOAD', file), nameCmd);
                //     }
                // }
                global.client.cmds.push(command);
            } else {
                logger.warn(nameCmd + ': ' + global.getText('NAMESAKE'));
            }
        } catch (err) {
            logger.error(global.getText('ERROR_LOAD_FILE', file, err.stack));
        }
    }
    logger.log(global.getText('COMMAND_LOAD_FILE', listFile.length), 'command');
};

export async function events({ Config, logger, Threads, Users }) {
    const listFile = readdirSync(client.dirMain + '/modules/' + 'events').filter(item => item.endsWith(".js") && !item.includes("example"));
    for (var file of listFile) {
        try {
            const event = await import('../../' + '/modules/' + 'events/' + file);
            const nameEvent = event.config.name;
            if (global.client.events.findIndex(i => i.config.name == nameEvent) < 0) {
                if (event.onLoad) {
                    event.onLoad({ Config, logger, Threads, Users });
                }
                // if (!envConfig.envEvents.find(e => e.name == event.config.name)) {
                //     if (event.config.envConfig) {
                //         envConfig.envEvents.push({ name: event.config.name, configEvent: event.config.envConfig });
                //         writeFileSync(global.dirEnvConfig, JSON.stringify(envConfig, null, 4), "utf-8");
                //         logger.load(global.getText('ENVCONFIG_LOAD', file), nameEvent);
                //     }
                // }
                global.client.events.push(event);
            } else {
                logger.warn(nameCmd + getText('NAMESAKE'));
            }
        } catch (err) {
            logger.error(global.getText('ERROR_LOAD_FILE', file, err.stack));
        }
    }
    logger.log(global.getText('EVENT_LOAD_FILE', listFile.length), 'event');
};

export async function games({ Config, logger, Threads, Users }) {
    const dirFile = path.join(client.dirMain + '/modules/' + 'games')
    const listFile = readdirSync(dirFile).filter(item => item.endsWith(".js") && !item.includes("example"));
    for (var file of listFile) {
        try {
            let command = await import('../../' + '/modules/' + 'games/' + file);
            const nameCmd = command.config.name;
            if (global.client.games.findIndex(i => i.config.name == nameCmd) < 0) {
                if (command.onLoad) {
                    command.onLoad({ Config, logger, Threads, Users })
                }
                // if (!envConfig.envScripts.find(e => e.name == command.config.name)) {
                //     if (command.config.envConfig) {
                //         envConfig.envScripts.push({ name: command.config.name, configCommand: command.config.envConfig });
                //         writeFileSync(global.dirEnvConfig, JSON.stringify(envConfig, null, 4), "utf-8");
                //         logger.load(global.getText('ENVCONFIG_LOAD', file), nameCmd);
                //     }
                // }
                global.client.cmds.push(command);
            } else {
                logger.warn(nameCmd + global.getText('NAMESAKE'));
            }
        } catch (err) {
            logger.error(global.getText('ERROR_LOAD_FILE', file, err.stack));
        }
    }
    logger.log(global.getText('COMMAND_LOAD_FILE', listFile.length), 'command');
};

export async function database({ Config, logger, timeStart }) {
    if (global.client.config.DATABASE.type == 'mongodb') {
        try {
            await login({ logger });
            const threads_data = (await threadsModels.find({ type: 'thread' }))[0].data || {};
            const users_data = (await usersModels.find({ type: 'user' }))[0].data || {};
            global.data.allThreadData = threads_data;
            for (var key in threads_data) {
                if (key != undefined) {
                    global.data.allThreadID.push(key);
                    if (threads_data[key].banned = !undefined) {
                        if (threads_data[key].banned.status == true) {
                            global.data.threadBanned.push(threads_data[key].id)
                        }
                    }
                }
            }
            global.allUserData = users_data;
            for (key in users_data) {
                if (key != undefined) {
                    global.data.allUserID.push(key);
                    if (users_data[key].banned = !undefined) {
                        if (users_data[key].banned.status == true) {
                            global.data.userBanned.push(users_data[key].id)
                        }
                    }
                }
            }
            logger.log('\x1b[1;32m' + global.getText('DATABASE_READ_YES', global.data.allThreadID.length, global.data.allUserID.length) + '\n', 'Database');
        } catch (err) {
            logger.error(err.stack);
        }
    }
    else {
        const pathThreads = join(client.dirMain, '/src/database/dataJson/', 'threads.json');
        const pathUsers = join(client.dirMain, '/src/database/dataJson/', 'users.json');
        const Threads = {},
            Users = {};
        if (!existsSync(pathThreads)) {
            writeFileSync(pathThreads, JSON.stringify(Threads, null, 2));
        }
        if (!existsSync(pathUsers)) {
            writeFileSync(pathUsers, JSON.stringify(Users, null, 2));
        }
        const threads_data = require(pathThreads);
        const users_data = require(pathUsers);

        global.data.allThreadData = threads_data;
        for (var key in threads_data) {
            if (key != undefined) {
                global.data.allThreadID.push(key);
                if (threads_data[key].banned != undefined && threads_data[key].banned.status == true) {
                    global.data.threadBanned.push(threads_data[key].id)
                }
            }
        }
        global.allUserData = users_data;
        for (key in users_data) {
            if (key != undefined) {
                global.data.allUserID.push(key);
                if (users_data[key].banned != undefined && users_data[key].banned.status == true) {
                    global.data.userBanned.push(users_data[key].id)
                }
            }
        }

        logger.log('\x1b[1;36m' + global.getText('CHOOSE_DATABASE_LOCAL'), 'Local');
        logger.log('\x1b[1;32m' + global.getText('DATABASE_READ_YES', global.data.allThreadID.length, global.data.allUserID.length) + '\n', 'Database');
    }
};
