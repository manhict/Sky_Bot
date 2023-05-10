'use strict';
export const config = {
    name: 'chart',
    version: '1.0.0',
    role: 0,
    author: ['Horizon'],
    description: 'Tạo Sơ Đồ Tương Tác Với Top 8 Nhóm.',
    enDesc: 'Create a chart of interaction with the top 8 groups.',
    category: ["Nhóm chat", "Group"],
    usages: "",
    timestamps: 10
}

import { createReadStream, unlinkSync, writeFileSync } from 'fs';
import axios from 'axios';

var path = process.cwd() + `/caches/chart.png`;

export async function onMessage({ api, event }) {
    try {
        var KMath = (data) => data.reduce((a, b) => a + b, 0);
        var inbox = await api.getThreadList(100, null, ['INBOX']);
        let xx = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        var kho = [],
            search = [],
            count = [];
        for (let n of xx) {
            var threadInfo = n.name;
            var threadye = n.messageCount;
            kho.push({ "name": threadInfo, "exp": (typeof await threadye == "undefined") ? 0 : await threadye });
        }
        kho.sort(function (a, b) { return b.exp - a.exp; });
        for (let num = 0; num < 5; num++) {
            search.push("'" + kho[num].name + "'");
            count.push(kho[num].exp);
        }

        var full = await KMath(count);
        var url = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${encodeURIComponent(search)}],datasets:[{label:'${encodeURIComponent('Tương Tác')}',data:[${encodeURIComponent(count)}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${full}',font:{size:26}},{text:'${encodeURIComponent('Tổng')}'}]}}}}`;
        const { data: stream } = await axios.get(url, { method: 'GET', responseType: 'arraybuffer' });
        writeFileSync(path, Buffer.from(stream, 'utf-8'));
        return api.sendMessage({ body: '', attachment: createReadStream(path) }, event.threadID, event.messageID);
    } catch (error) {
        console.log(error);
    }
};