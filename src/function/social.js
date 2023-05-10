
import fetch from 'node-fetch';
import axios from 'axios';
import * as fs from 'fs'
import * as utils from './utils.js'
import { createRequire } from "module"
const require = createRequire(import.meta.url)

/**
* ________________ Facebook API __________________ 
*/
const dirFbstate = process.cwd() + '/fbstate.json';
if (!fs.existsSync(dirFbstate)) {
    fs.writeFileSync(dirFbstate, JSON.stringify([], null, 2));
}

const rqFbstate = require(dirFbstate);
const appState = JSON.parse(JSON.stringify(rqFbstate, 'null', '\t'));
if (typeof appState === 'string') {
    var cookieFb = appState;
} else if (typeof appState === 'object') {
    var cookieFb = utils.stringifyAppstate(appState)
} else {
    var cookieFb = ''
}

var headers = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "www.facebook.com",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
    "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    cookie: cookieFb
}

export function finduid(link) {
    return new Promise((resolve, reject) => {
        console.log(cookieFb)
        if (check_real_leteger_number(link) == 1) return resolve(parseInt(link));

        var splitUrl = link.replace('m.', '') || url.replace('www.', '');
        var idfacebook = null;
        var post = splitUrl.match(/(.*)\/posts\/([0-9]{8,})/);
        var profile = splitUrl.match(/(.*)\/([0-9]{8,})/);
        var photo = splitUrl.match(/(.*)\/photo.php\?fbid=([0-9]{8,})/);
        var photo2 = splitUrl.match(/(.*)\/photo\/\?fbid=([0-9]{8,})/);
        var photo3 = splitUrl.match(/(.*)\/photo\?fbid=([0-9]{8,})/);
        var video = splitUrl.match(/(.*)\/video.php\?v=([0-9]{8,})/);
        var story = splitUrl.match(/(.*)\/story.php\?story_fbid=([0-9]{8,})/);
        var permalink = splitUrl.match(/(.*)\/permalink.php\?story_fbid=([0-9]{8,})/);
        var number = splitUrl.match(/(.*)\/([0-9]{8,})/);
        var comment = splitUrl.match(/(.*)comment_id=([0-9]{8,})/);
        var media = splitUrl.match(/(.*)media\/set\/\?set=a\.([0-9]{8,})/);
        var watch = splitUrl.match(/(.*)\/watch\/\?v=([0-9]{8,})/);
        if (comment) {
            idfacebook = comment[2]
        } else if (photo) {
            idfacebook = photo[2]
        } else if (photo2) {
            idfacebook = photo2[2]
        } else if (photo3) { } else if (video) {
            idfacebook = video[2]
        } else if (story) {
            idfacebook = story[2]
        } else if (permalink) {
            idfacebook = permalink[2]
        } else if (number) {
            idfacebook = number[2]
        } else if (media) {
            idfacebook = media[2]
        } else if (watch) {
            idfacebook = watch[2]
        } else if (post) {
            idfacebook += '_' + post[2]
        } else if (profile) {
            idfacebook = profile[3];
        };
        var idYes = idfacebook;

        if (!idfacebook && !isNaN(idfacebook)) {
            axios.get(link, { headers })
                .then(res => {
                    let parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;
                    let _idGet = "";
                    let _uid = res.data.match(/"userID":"(.*?)"/);
                    if (_uid && _uid[1]) {
                        _idGet = parseString(_uid[1])
                    }
                    else {
                        let _uid2 = res.data.match(/"entity_id":"(.*?)"/);
                        // console.log(_uid2[1])
                        _idGet = _uid2 && _uid2[1] ? parseString(_uid2[1]) : ""
                    }
                    resolve(_idGet);
                })
                .catch(reject)
        } else resolve(idYes)

    })
}


/**
 * KQ SXMB
 * 
 */
export function xsmb() {
    return new Promise((resolve, reject) => {
        axios.get('https://xskt.com.vn/rss-feed/mien-bac-xsmb.rss', {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36"
            }
        }).then(res => {
            let data = res.data;
            let title = data.match(/<title>(.*?)<\/title>/g);
            let description = data.match(/<description>([^>]*)<\/description>/g);
            let regexDesc = description[1].replace('<description>', '').replace('</description>', '');
            let regexTitle = title[1].replace('<title>', '').replace('</title>', '');
            resolve(regexTitle + '\n' + regexDesc);
        }).catch(reject)
    })
}

/**
 * Check Number
 * 
 */
function check_real_leteger_number(n) {
    //flag = 1 => số nguyên
    //flag = 0 => số thực
    let flag = 1;
    if (Math.ceil(n) != Math.floor(n)) flag = 0;
    return flag;
}