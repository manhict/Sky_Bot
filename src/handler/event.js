// This code has been cleaned up to be more concise and readable:
export default async function ({ api, event, message, Config, logger, Threads, Users, envGlobal, envCommands, envEvents }) {
    const time = global.utils.getTimeZone();
    const { threadID, senderID, messageID, args, body: content, logMessageType } = event;
    const { events, cmds } = global.client;
    const { threadBanned, userBanned } = global.data;

    const dataThread = await Threads.getData(threadID);
    const langThread = dataThread.language || Config['LANGUAGE_SYS'];

    if (userBanned.includes(senderID) || threadBanned.includes(threadID)) {
        return;
    }

    for (const runEvent of events) {
        if (runEvent.config.eventType.includes(logMessageType)) {
            const lang = runEvent.languages?.[langThread] || {};
            const getTextC = createGetText(lang, langThread);

            try {
                const obj = { api, event, args, Config, logger, message, Threads, Users, envGlobal, envCommands, envEvents, getText: getTextC };
                runEvent.onMessage(obj);
            } catch (error) {
                logger.error(global.getText('HANDLER_ERROR', error.stack), 'runEvent');
                message.reply(error.message);
            }
        }
    }

    if (!senderID || isNaN(senderID) || senderID < 4 || ['presence', 'typ', 'read_receipt'].includes(event.type)) {
        return;
    }

    for (const run of cmds) {
        const lang = run.languages?.[langThread] || {};
        const getTextC = createGetText(lang, langThread);

        try {
            const obj = { api, event, args, Config, logger, message, Threads, Users, envGlobal, envCommands, envEvents, getText: getTextC };
            if (run.onEvent) {
                run.onEvent(obj);
            }
        } catch (error) {
            logger.error(global.getText('HANDLER_ERROR', error.stack), 'onEvent');
            message.reply(error.message);
        }
    }

    function createGetText(languages, langThread) {
        return (...values) => {
            const langObject = languages?.[langThread] || {};
            let lang = langObject[values[0]] || '';
            for (let i = values.length; i > 0; i--) {
                const expReg = new RegExp('%' + i, 'g');
                lang = lang.replace(expReg, values[i]);
            }
            return lang;
        };
    }

    if (Config['DEVMODE'] === 'super' && senderID !== api.getCurrentUserID() && event.type !== 'message_unsend') {
        const nameUser = await Users.getName(senderID) || senderID;
        const nameThread = dataThread['name'] || nameUser;

        const color1 = ["\x1b[1;33m", "\x1b[1;34m", "\x1b[1;35m", '\x1b[1;36m', '\x1b[1;31m', '\x1b[1m'];
        const more1 = color1[Math.floor(Math.random() * color1.length)];
      
        const color2 = ["\x1b[1;34m", "\x1b[1;33m", "\x1b[1;31m", '\x1b[1m', '\x1b[1;34m', '\x1b[1;36m'];
        const more2 = color2[Math.floor(Math.random() * color2.length)];
      
        const color3 = ["\x1b[1;37m"];
        const more3 = color3[Math.floor(Math.random() * color3.length)];
      
        console.log('〈 ' + more1 + time + '\x1b[1;37m 〉➤ ' + '\x1b[1;32m' + 'Box: ' + more1 + '' + nameThread + '\x1b[1;37m -> ' + more2 + '' + nameUser + '\x1b[1;37m -> ' + more3 + '' + (event['body'] || event['reaction'] || event.attachments[0]?.url || 'message_unsend'));
    }
}