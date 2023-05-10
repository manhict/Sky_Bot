'use strict';
export const config = {
    name: 'fast',
    version: '1.0.0',
    role: 2,
    author: ['Sky'],
    viDesc: 'Xem tốc độ mạng.',
    enDesc: 'Views network speed.',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0
};

import fast from 'fast-api-remake'

export async function onMessage({ event, api }) {
    const speedTest = new fast({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 5,
        bufferSize: 8,
        unit: fast.UNITS.Mbps
    });
    speedTest.getSpeed()
        .then((speed) => {
            return api.sendMessage(
                "=== Result ===" +
                "\n- Speed: " + speed.toFixed() + " Mbps",
                event.threadID, event.messageID
            );
        })
        .catch((err) => {
            return api.sendMessage("Error: " + err, event.threadID, event.messageID);
        });

}