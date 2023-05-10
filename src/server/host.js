import express from "express"
const app = express()
import getLang from "../function/getLang.js";
import * as logger from "../function/logger.js"
import checkUpdate from "../system/update.js"
const VERSION = "1.0.0";
checkUpdate(VERSION)

const skylogo1 = `______     __  __     __  __     ______     ______     ______`
const skylogo2 = `/\   ___\\   /\\ \\/ /    /\\ \\_\\ \\   /\\  == \\   /\\  __ \\   /\\__  _\\`
const skylogo3 = `\\ \\___  \\  \\ \\  _"-.  \\ \\____ \\  \\ \\  __<   \\ \\ \\/\\ \\  \\/_/\\ \\/`
const skylogo4 = ` \\/\\_____\\  \\ \\_\\ \\_\\  \\/\\_____\\  \\ \\_____\\  \\ \\_____\\    \\ \\_\\`
const skylogo5 = `  \\/_____/   \\/_/\\/_/   \\/_____/   \\/_____/   \\/_____/     \\/_/`

logger.printCenteredText(skylogo1)
logger.printCenteredText(skylogo2)
logger.printCenteredText(skylogo3)
logger.printCenteredText(skylogo4)
logger.printCenteredText(skylogo5)
  
console.log('\n')
logger.printCenteredText((`_____________________ SKY BOT ________________________`))
logger.printCenteredText(('*                                                    *'))
logger.printCenteredText(('*   Update: 11/05/2023 || 02:30 PM                   *'))
logger.printCenteredText(('*   Version: ' + VERSION + '                                   *'))
logger.printCenteredText(('*   Authors: ManhG (Sky)                             *'))
logger.printCenteredText(('*   Zalo: 086.598.3826                               *'))
logger.printCenteredText(('*   Facebook: https://facebook.com/support.manhict   *'))
logger.printCenteredText(('*   Nếu có lỗi xảy ra liên hệ để được hỗ trợ         *'))
logger.printCenteredText(('______________________________________________________'))
console.log('\n')
logger.printCenteredText(('Liên kết hỗ trợ: https://t.me/manhict'))
console.log('\n')

//_____________________________UPTIME HOST_____________________________//
let port = Math.floor(Math.random() * (9999 - 1000) + 1000);
app.set('port', (process.env.PORT || port));
app.get('/', function (request, response) {
    var result = 'A simple Facebook Messenger Bot made ManhG.'
    response.sendFile(process.cwd() + '/src/views/index.html')
    // response.redirect('https://nguyenmanh.name.vn/videodl')
}).listen(app.get('port'));
global.portUptime = app.get('port');
logger.load(getLang('HOST_UPTIME', app.get('port')), 'SEVER UPTIME');