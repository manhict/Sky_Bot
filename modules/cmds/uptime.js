"use strict";
export const config = {
    name: 'uptime',
    role: 0,
    version: '1.0.0',
    author: ['manhG'],
    category: ['Hệ thống', 'System'],
    viDesc: 'uptime',
    enDesc: 'uptime',
    usages: '',
    timestamp: 0
};
import * as fs from 'fs'
import fast from 'fast-api-remake'
import moment from 'moment-timezone';
export async function onMessage({ api, event, Threads }) {
    const speedTest = new fast({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 5,
        bufferSize: 8,
        unit: fast.UNITS.Mbps
    });
    const result = await speedTest.getSpeed();
    const getTimeZone = moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY | hh:mm:ss");

    var uptime = process.uptime();
    var hours = Math.floor(uptime / (60 * 60));
    var minutes = Math.floor((uptime % (60 * 60)) / 60);
    var seconds = Math.floor(uptime % 60);
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return await api.sendMessage({
        body: '〈 ' + hours + ':' + minutes + ':' + seconds + ' 〉\n' + '↗ Speed: ' + result.toFixed() + ' Mbps ' + '\n\n〘' + ' ✎﹏﹏﹏SkyBot ' + '〙' +'\n'+ getTimeZone,
        //attachment: fs.createReadStream(process.cwd() + "/img/esp.png")
    }, event.threadID, event.messageID);
}
