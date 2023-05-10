"use strict";
export const config = {
    name: 'run',
    role: 2,
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'run code.',
    enDesc: 'run code',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0,
};
export async function onMessage({ event, api, Config, logger, Threads, Users, args, message }) {
    const { threadID, senderID, messageID } = event;

    const botID = api.getCurrentUserID();
    const out = function (a) {
        // if (typeof a === "object" || typeof a === "array") {
        //     a = JSON.stringify(a, null, 4);
        // }
        // if (typeof a === "number") {
        //     a = a.toString();
        // }
        console.log('send: ', a);
        return api.sendMessage(a, threadID, messageID);
    }

    try {
        if (["https://", "http://"].includes(args.join(' '))) {
            await eval(args.join(' '), true)
                .then(data => {
                    return out(data)
                })
        } else {
            let utils = global.utils,
                sky = global.sky;
            const response = await eval(args.join(' '), { sky, event, api, Config, logger, utils, Threads, Users, botID, args, senderID, threadID, message }, true);
            const f = JSON.stringify(response, null, 4);
            if (f == "true" || f == "false" || typeof f === "object" || typeof f === "array") {
                return out(f)
            }
            if (f != undefined) {
                const g = f.replace(`"`, "");
                const h = g.replace(`"`, "");
                return out(h);
            } else return out(f);
        }
    } catch (err) {
        console.log(err.message);
        out(err.message);
    }
}