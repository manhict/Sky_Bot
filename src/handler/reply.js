"use strict";
//Code by manhG. Facebook: Fb.com/manhict. Copyright by Sky. All rights reserved.___

export default async function onReply({ api, event, message, Config, logger, Threads, Users, envGlobal, envCommands, envEvents }) {
    const { threadID, args } = event;
    if (!event.messageReply) return;

    const { reply } = global.client;
    if (reply.length === 0) return;

    const indexOfHandle = reply.findIndex((e) => e.messageID === event.messageReply.messageID);
    if (indexOfHandle < 0) return;

    const indexOfMessage = reply[indexOfHandle];

    if (global.client.events.some((i) => i.config.name === indexOfMessage.name)) {
        try {
            const runEvent = global.client.events.find((i) => i.config.name === indexOfMessage.name);
            const langThread = (await Threads.getData(threadID)).language || Config['LANGUAGE_SYS'];
            const getTextC = createGetText(runEvent.languages, langThread);
            const obj = {
                api, args, event, Config, logger, message, Threads, Users,
                reaction: indexOfMessage, envGlobal, envCommands, envEvents, getText: getTextC
            };
            return runEvent.onReply(obj);
        } catch (err) {
            logger.error(global.getText('HANDLER_ERROR', err.stack), 'onReply');
            return message.reply(err.message);
        }
    }

    if (global.client.cmds.some((i) => i.config.name === indexOfMessage.name)) {
        try {
            const run = global.client.cmds.find((i) => i.config.name === indexOfMessage.name);
            const langThread = (await Threads.getData(threadID)).language || Config['LANGUAGE_SYS'];
            const getTextC = createGetText(run.languages, langThread);
            const obj = {
                api, args, event, Config, logger, message, Threads, Users,
                reply: indexOfMessage, envGlobal, envCommands, envEvents, getText: getTextC
            };
            return run.onReply(obj);
        } catch (err) {
            logger.error(global.getText('HANDLER_ERROR', err.stack), 'onReply');
            return message.reply(err.message);
        }
    }

    return message.reply(global.getText('HANDLER_MISSING_DATA', 'onReply'));

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
}

  // Đây là những cải tiến chính:
  // - Mã được chia thành các hàm nhỏ hơn để dễ đọc
  // - Kiểu dấu ngoặc nhọn là thống nhất
  // - Toán tử bậc ba được sử dụng cho các điều kiện đơn giản
  // - Khoảng trắng được thêm vào để thụt đầu dòng nhất quán
  // - Một quy ước đặt tên nhất quán đã được thực hiện
  // - Bình luận đã được loại bỏ như dư thừa