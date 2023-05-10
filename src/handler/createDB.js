"use strict";
export default async function ({ event, logger, Threads, Users, Config }) {
    try {
        process.setMaxListeners(Infinity);
        const { threadID, isGroup } = event;
        const senderID = event.senderID || event.author || event.from;

        // ——————————————/     CREATE THREAD DATA   /—————————————— //
        if (!global.data.allThreadData[threadID] && !isNaN(threadID) && threadID > 0 && threadID != undefined) {
            try {
                if (global.data.allThreadID.includes(threadID)) return;
                await Threads.createData(threadID);
                if (global.data.allThreadData[threadID] == undefined) return;
                return logger.log(`\x1b[1;32mNew Thread: \x1b[1;37m${threadID} | \x1b[1;35m${global.data.allThreadData[threadID].name} | \x1b[1;37m${Config.DATABASE.type}\x1b[37m`, "DATABASE");
            } catch (err) { logger.error(err.stack, "Create Threads") }
        }
        // ———————————————/     CREATE USER DATA    /——————————————— //
        if (!global.data.allUserData[senderID] && !isNaN(senderID) && senderID > 0 && senderID != undefined) {
            try {
                if (global.data.allUserID.includes(senderID)) return;
                await Users.createData(senderID);
                if (global.data.allUserData[senderID] == undefined) return;
                return logger.log(`\x1b[1;36mNew User: \x1b[1;37m${senderID} | \x1b[1;33m${global.data.allUserData[senderID].name} | \x1b[1;37m${Config.DATABASE.type}\x1b[37m`, "DATABASE");
            } catch (err) { logger.error(err.stack, "Create Users") }
        }
    } catch (e) {
        logger.error(e.stack, "HANDLE CREATE DATABASE");
    }
}