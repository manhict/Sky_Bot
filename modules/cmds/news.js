'use strict';
export const config = {
    name: 'news',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tin tức trên vnexpress.net.',
    enDesc: 'News on vnexpress.net.',
    category: ['Tin tức', 'Social'],
    usage: '',
    timestamp: 0
}

export const languages = {
    "vi_VN": {
        "MissingInput": "Hãy nhập từ khóa bạn muốn tìm kiếm",
        "notFoundResult": "Không có kết quả nào với từ khóa của bạn"
    },
    "en_US": {
        "MissingInput": "Enter what you want to search ",
        "notFoundResult": "There is no result match your input"
    }
}

import axios from 'axios'
import https from 'https'
import cheerio from 'cheerio'

export async function onMessage({ api, event, args, getText }) {
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
    var url = "https://timkiem.vnexpress.net/?q=";
    var q = args.join(" ");
    if (!q) return out(getText("missingInput"));

    function certificate({ url }) {
        return new Promise(async function (resolve, reject) {
            try {
                var data = (await axios({
                    url: url,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    responseType: "",
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                })).data;
                return resolve(data);
            } catch (e) {
                return reject(e);
            }
        })
    };

    url = url + encodeURIComponent(q);
    var data = await certificate({ url });
    var $ = cheerio.load(data);

    if (!$('h3.title-news').eq(0).text()) return out(getText("notFoundResult"));
    for (let e = 0; e < 3; e++) {
        var title = JSON.stringify($('h3.title-news').eq(e).text()).replace(/\\n|\\t|\"/g, "");
        var desc = $('p.description').eq(e).text();
        var link = $('h3.title-news a').eq(e).attr('href');
        out(`${title}\n\n${desc}\n${link}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}