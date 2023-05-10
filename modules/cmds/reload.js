"use strict";

const config = {
    name: 'reload',
    version: '1.0.0',
    role: 3,
    author: ['Sky'],
    category: ['Hệ thống', 'System'],
    usages: '',
    viDesc: 'Reload scripts and events',
    enDesc: 'Reload scripts and events',
    timestamp: 5
}

function LOAD({ Config, logger, getText, Threads, Users }) {
    try {
        const obj = {};
        obj.timeStart = Date.now();
        obj.config = Config;
        obj.logger = logger;
        obj.getText = getText;
        obj.Threads = Threads;
        obj.Users = Users;
        client.scripts = new Array();
        client.events = new Array();
        client.database = new Array();
        // console.clear();
        logger.load('DONE SUCCESS RELOAD SCRIPTS AND EVENTS', 'reload');
        return { fail: false };
    } catch (err) {
        logger.error(err.stack, 'reload');
        return { fail: true, error: err };
    }
}

function onMessage({ api, event, Config, logger, getText, Threads, Users }) {
    try {
        const obj = {};
        obj.timeStart = Date.now();
        obj.config = Config;
        obj.logger = logger;
        obj.getText = getText;
        obj.Threads = Threads;
        obj.Users = Users;
        let s = LOAD(obj);
        if (s.fail == false) {
            return api.sendMessage('Done', event.threadID, event.messageID);
        }
    } catch (ex) {
        return api.sendMessage(ex.message, event.threadID, event.messageID);
    }
}

export {
    config,
    onMessage
}