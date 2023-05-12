import express from "express"
const app = express()
import getLang from "../function/getLang.js";
import * as logger from "../function/logger.js"
import checkUpdate from "../system/update.js"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const packagez = require("../../package.json")
const VERSION = packagez.version;
checkUpdate(VERSION)

const _0x2aa3fd=_0x4b82;function _0x4b82(a,_){const f=_0xd9fe();return(_0x4b82=function(a,_){return f[a-=290]})(a,_)}!function(a,_){const f=_0x4b82,x=_0xd9fe();for(;;)try{if(391255===-parseInt(f(331))/1+-parseInt(f(316))/2+parseInt(f(364))/3+-parseInt(f(298))/4+parseInt(f(310))/5*(-parseInt(f(347))/6)+parseInt(f(342))/7+parseInt(f(338))/8)break;x.push(x.shift())}catch(a){x.push(x.shift())}}();const skylogo1=_0x2aa3fd(337)+_0x2aa3fd(362)+_0x2aa3fd(290)+_0x2aa3fd(294)+_0x2aa3fd(308)+_0x2aa3fd(312)+"_",skylogo2=_0x2aa3fd(295)+_0x2aa3fd(350)+_0x2aa3fd(297)+_0x2aa3fd(344)+_0x2aa3fd(314)+_0x2aa3fd(301)+_0x2aa3fd(296),skylogo3=_0x2aa3fd(335)+_0x2aa3fd(357)+_0x2aa3fd(366)+_0x2aa3fd(307)+_0x2aa3fd(360)+_0x2aa3fd(349)+_0x2aa3fd(311),skylogo4=_0x2aa3fd(329)+_0x2aa3fd(327)+_0x2aa3fd(340)+_0x2aa3fd(326)+_0x2aa3fd(304)+_0x2aa3fd(302)+_0x2aa3fd(313),skylogo5=_0x2aa3fd(303)+_0x2aa3fd(339)+_0x2aa3fd(305)+_0x2aa3fd(322)+_0x2aa3fd(361)+_0x2aa3fd(306)+_0x2aa3fd(293);function _0xd9fe(){const a=["/   ___\\  "," _\\","  /\\ \\_\\ \\","58356weyUCn","23 || 02:3","để được hỗ"," \\   /\\__ ","___\\    \\ ","  \\/_____/","__\\  \\ \\__","/   \\/____","___/     \\","\\  \\ \\  __","    ______","manhict","370Liiegf"," \\/","     _____","\\_\\","\\   /\\  __","ỗ trợ: htt","675454mGkFzo","____","Sky)      ","*   Facebo","n: ","          ","_/   \\/___","printCente","*   Versio","26        ","_\\  \\ \\___","  \\ \\_\\ \\_","_ SKY BOT "," \\/\\_____\\","0 PM      ","322036GgYUbz",": 11/05/20","ok: https:","s: ManhG (","\\ \\___  \\ ","*   Author","______    ","7178008qnmpNI","   \\/_/\\/_","\\  \\/\\____","*         ","3658375EcHVUf","ps://t.me/","   /\\  == ","//facebook","Liên kết h","29598NXKfaV",".com/suppo","\\ \\  \\/_/\\"," /\\ \\/ /  ","a liên hệ ","*   Nếu có"," lỗi xảy r","   *","redText","086.598.38",' \\ \\  _"-.',"__________","rt.manhict","<   \\ \\ \\/","__/   \\/__"," __  __   ","log","32319uRXUQZ","*   Zalo: ","  \\ \\____ ","*   Update","  __  __  ","     *"," trợ      ","/_/","   ______ "];return(_0xd9fe=function(){return a})()}logger[_0x2aa3fd(323)+_0x2aa3fd(355)](skylogo1),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](skylogo2),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](skylogo3),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](skylogo4),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](skylogo5),console[_0x2aa3fd(363)]("\n"),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(358)+_0x2aa3fd(358)+_0x2aa3fd(328)+_0x2aa3fd(358)+_0x2aa3fd(358)+_0x2aa3fd(317)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(341)+_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(354)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(367)+_0x2aa3fd(332)+_0x2aa3fd(299)+_0x2aa3fd(330)+_0x2aa3fd(321)+_0x2aa3fd(354)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(324)+_0x2aa3fd(320)+VERSION+(_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(291))),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(336)+_0x2aa3fd(334)+_0x2aa3fd(318)+_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(354)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(365)+_0x2aa3fd(356)+_0x2aa3fd(325)+_0x2aa3fd(321)+_0x2aa3fd(321)+_0x2aa3fd(354)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(319)+_0x2aa3fd(333)+_0x2aa3fd(345)+_0x2aa3fd(348)+_0x2aa3fd(359)+_0x2aa3fd(354)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(352)+_0x2aa3fd(353)+_0x2aa3fd(351)+_0x2aa3fd(300)+_0x2aa3fd(292)+_0x2aa3fd(354)),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(358)+_0x2aa3fd(358)+_0x2aa3fd(358)+_0x2aa3fd(358)+_0x2aa3fd(358)+_0x2aa3fd(317)),console[_0x2aa3fd(363)]("\n"),logger[_0x2aa3fd(323)+_0x2aa3fd(355)](_0x2aa3fd(346)+_0x2aa3fd(315)+_0x2aa3fd(343)+_0x2aa3fd(309)),console[_0x2aa3fd(363)]("\n");

//_____________________________UPTIME HOST_____________________________//
let port = Math.floor(Math.random() * (9999 - 1000) + 1000);
app.set('port', (process.env.PORT || port));
app.get('/', function (request, response) {
    var result = 'A simple Facebook Messenger Bot made ManhG.'
    //     response.sendFile(process.cwd() + '/src/views/index.html')
    // response.redirect('https://manhict.up.railway.app/')
    response.send(result);
}).listen(app.get('port'));
global.portUptime = app.get('port');
logger.load(getLang('HOST_UPTIME', app.get('port')), 'SEVER UPTIME');
