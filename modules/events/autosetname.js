'use strict';
export const config= {
    name: 'autosetname',
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Notice of leaving the group',
    eventType: ["log:unsubscribe"]
};
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
export async function onMessage({ event, api, Config, logger, Threads, Users }) {
    // const { threadID } = event;
    // var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId)
    // for (let idUser of memJoin) {
        
    //     const pathData = join("./scripts", "cache", "autosetname.json");
    //     var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    //     var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
    //     if (thisThread.nameUser.length == 0) return;
    //     if (thisThread.nameUser.length != 0) {
    //         var setName = thisThread.nameUser[0]
    //         await new Promise(resolve => setTimeout(resolve, 1000));
    //         var namee1 = await api.getUserInfo(idUser)
    //         var namee = namee1[idUser].name
    //         api.changeNickname(`${setName} ${namee}`, threadID, idUser);
    //         api.sendMessage(`Đã set biệt danh tạm thời cho ${namee}`, threadID, event.messageID)
    //     }
    // }
}