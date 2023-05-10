'use strict';
export const config = {
    name: 'setname',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Set biệt danh cho thành viên.',
    enDesc: 'Set nicknames for members.',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '',
    timestamp: 0
};
export async function onMessage({ event, api, Config, logger, Threads, Users, args, body }) {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    switch (args[0]) {
        case "all":{
            try {
                var idtv = event.participantIDs;
                if (idtv != api.getCurrentUserID()) {
                    const name = args.slice(1).join(" ");
                    for (let setname of idtv) {
                        await delay(3000)
                        api.changeNickname(`${name}`, event.threadID, setname);
                    }
                }
            } catch (error) {
                api.sendMessage(error.message || error.error, event.threadID)
            }
        }
        break;

        default:
            {
              try{
                const name = args.join(" ")
                const mention = Object.keys(event.mentions)[0];
                if (event.type == "message_reply") { return api.changeNickname(`${name}`, event.threadID, event.messageReply.senderID) }
                if (!mention && event.type != "message_reply") return api.changeNickname(`${name}`, event.threadID, event.senderID);
                if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
              }
              catch(error){
                api.sendMessage(error.message || error.error, event.threadID)
              }
            }
            break;
    }
}
