"use strict";

/**
 * Chứa các function thông thường được sử dụng nhiều<br>
 * Hướng dẫn sử dụng:<br>
 * import {<tên hàm 1>, <tên hàm 2>} from "./util.js"<br>
 * Ví dụ:
 * <code>import {asyncWait, round, extend} from "./util.js"</code>
 * @module UTILS
 */
import fetch from "node-fetch"
import axios from "axios";
import https from 'https'
import request from 'request'
import minimist from "minimist"
import * as fs from 'fs'
import moment from "moment-timezone";

/**
 * Download FILE Facebook chat api one FCA
 * @param  path Đường dẫn tới file
 * @example
 * downloadFile(__dirname + "/test.mp4");
 * 
 */
export async function downloadMedia(event) {
    var pathAttachment = [];
    if (event.attachments.length != 0) {
        var urlPath = event.attachments[0].url;
        var getURL = await request.get(urlPath);
        var pathname = getURL.uri.pathname;
        var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
        var getdata = (await axios.get(`${urlPath}`, { responseType: 'arraybuffer' })).data;
        var path = process.cwd() + '/caches/' + Date.now() + `_downloadMedia.${ext}`;
        fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));
        pathAttachment.push(fs.createReadStream(path))
    }
    else {
        if (event.type == "message_reply") {
            if (event.messageReply.attachments[0] == undefined) return;
            var urlPath = event.messageReply.attachments[0].url;
            var getURL = await request.get(urlPath);
            var pathname = getURL.uri.pathname;
            var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
            let getdata = (await axios.get(`${urlPath}`, { responseType: 'arraybuffer' })).data;
            var path = process.cwd() + '/caches/' + Date.now() + `_downloadMedia.${ext}`;
            fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));
            pathAttachment.push(fs.createReadStream(path))
        }
    }
    return pathAttachment;
};

/**
 * Download FILE
 * @param  path Đường dẫn tới file
 * @example
 * downloadFile(__dirname + "/test.txt");
 * 
 */
export function fileNameValidation(filePath) {
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.mp3|\.mp4|\.json|\.txt|\.js|\.zip|\.wma)$/i; //các tập tin cho phép
    //Kiểm tra định dạng
    if (!allowedExtensions.exec(filePath)) {
        filePath = 'txt';
        return filePath;
    } else {
        return extname(filePath);
    }
}

export async function dl(url, path) {
    url.includes("https://") ? url : url = "https://" + url;
    axios.get(url, { responseType: "arraybuffer" })
        .then((data) => {
            var ext = data.headers["content-type"].split("/")[1].split(";")[0];
            path == undefined ? path = process.cwd() + '/caches/' + Date.now() + '.' + ext : path;
            fs.writeFileSync(path, Buffer.from(data.data, "utf-8"))
            global.message.reply({ attachment: fs.createReadStream(path) }, () => fs.unlinkSync(path))
        })
        .catch(error => global.message.reply(error.message))
};

export async function downloadFile(url, path) {
    return new Promise(async (resolve, reject) => {
        axios.get(url, { responseType: "arraybuffer" })
            .then((data) => {
                fs.writeFileSync(path, Buffer.from(data.data, "utf-8"));
                return resolve(path)
            })
            .catch(reject)
    })
};

export async function downloadFileAxios(url, path) {
    const response = await axios({
        method: 'GET',
        responseType: 'stream',
        url
    });
    const writer = createWriteStream(path);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

export async function downloadFileFetch(url, path) {
    const res = await fetch(url)
    const fileStream = fs.createWriteStream(path)
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream)
        res.body.on("error", reject)
        fileStream.on("finish", resolve)
    })
}

export function downloadFileHttps(url, path) {
    return new Promise(async (resolve, reject) => {
        const req = https.get(url, (res) => {
            const file = fs.createWriteStream(path)
            res.pipe(file)
            file.on("error", (error) => {
                reject(error)
            })
            file.on("close", () => {
                resolve(file)
            })
            file.on('finish', () => {
                file.close()
                // console.log("Completely downloaded File.")
            })
        })
        req.on("error", (error) => {
            reject(error)
        })
    });
};

/* 
* convert Atp To Appstate Facebook
*/
export function convertAtpToAppstate(atp) {
    const unofficialAppState = []
    const items = atp.split(";|")[0].split(";")

    if (items.length < 2) throw "Not a atp cookie"
    const validItems = ["sb", "datr", "c_user", "xs"]
    for (const item of items) {
        const key = item.split("=")[0]
        const value = item.split("=")[1]
        if (validItems.includes(key)) {
            unofficialAppState.push({
                key,
                value,
                domain: "facebook.com",
                path: "/"
            })
        }
    }
    return unofficialAppState
}

/* 
* convert Appstate To Cookies Facebook
*/
export function convertCookieToAppstate(appState) {
    var cookies = '';
    appState.map((cookie) => {
        let cookieString = cookie.key + "=" + cookie.value + "; domain=" + cookie.domain + ";path=" + cookie.path + ";"
        // if (cookie.secure) cookieString += "secure;"
        // if (cookie.httpOnly) cookieString += "httpOnly;"
        // if (cookie.expirationDate) cookieString += "expires=" + new Date(cookie.expirationDate * 1000).toUTCString() + ";"
        cookies += cookieString
    });
    return cookies
}

export function stringifyAppstate(appstate) {
    return appstate.map(e => e.key = e.value).join(";")
}

/**
*    Func Get getTimeZone 
*    Example: ${dd}/${mm}/${yyyy} | ${HH}:${MM}:${SS}
*/
export function getTimeZone(option) {
    const date = new Date();
    const formatData = (input) => {
        if (input > 9) {
            return input;
        } else return `0${input}`;
    };

    // Function to convert
    // 24 Hour to 12 Hour clock
    const formatHour = (input) => {
        if (input > 12) {
            return input - 12;
        }
        return input;
    };

    // Data about date
    const format = {
        dd: formatData(date.getDate()),
        mm: formatData(date.getMonth() + 1),
        yyyy: date.getFullYear(),
        HH: formatData(date.getHours()),
        hh: formatData(formatHour(date.getHours())),
        MM: formatData(date.getMinutes()),
        SS: formatData(date.getSeconds()),
    };

    // Choose format
    switch (option) {
        case "dd":
            const formatdd = ({ dd }) => {
                return dd;
            };
            return formatdd(format);
        case "mm":
            const formatmm = ({ mm }) => {
                return mm;
            };
            return formatmm(format);
        case "time":
        case "Time":
            const format24Hour = ({ HH, MM, SS }) => {
                return `${HH}:${MM}:${SS}`;
            };
            return format24Hour(format);
        case "date":
        case "Date":
            const formatDate = ({ dd, mm, yyyy }) => {
                return `${dd}/${mm}/${yyyy}`;
            };
            return formatDate(format);
        default:
            const formatDate24Hour = ({ dd, mm, yyyy, HH, MM, SS }) => {
                return `${dd}/${mm}/${yyyy} | ${HH}:${MM}:${SS}`;
            };
            return formatDate24Hour(format);
    }
}

/**
*    Func Get DateTime 
*    Example: ${dd}/${mm}/${yyyy} | ${HH}:${MM}:${SS}
*/
export function getTime(option) {
    switch (option) {
        case "seconds":
            return `${moment.tz("Asia/Ho_Chi_minh").format("ss")}`;
        case "minutes":
            return `${moment.tz("Asia/Ho_Chi_minh").format("mm")}`;
        case "hours":
            return `${moment.tz("Asia/Ho_Chi_minh").format("HH")}`;
        case "date":
            return `${moment.tz("Asia/Ho_Chi_minh").format("DD")}`;
        case "month":
            return `${moment.tz("Asia/Ho_Chi_minh").format("MM")}`;
        case "year":
            return `${moment.tz("Asia/Ho_Chi_minh").format("YYYY")}`;
        case "fullHour":
            return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss")}`;
        case "fullYear":
            return `${moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY")}`;
        case "fullTime":
            return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY")}`;
        default:
            return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY")}`;
    }
}

/**
*    Random String
*/
export function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length || 5;
    for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

/**
 * Hàm dừng chương trình async
 * @async
 * @param  {Number} time Thời gian bạn muốn dừng (milisecond)
 * @example
 * console.log("Loi! Vui long gui lai sau 5 giay")
 * asyncWait(5000).then(() => {
 *  console.log("Ban co the gui lai duoc roi!");
 * });
 */
export const asyncWait = async time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
/**
 * Ràng buộc 1 giá trị trong khoảng từ [left; right]
 * @param  {Number} value Giá trị vào
 * @param  {Number} left  ràng buộc trái
 * @param  {Number} right ràng buộc phải
 * @return {Number} Giá trị trong khoảng [left; right]
 * @example
 * console.log(constrain(5, 1, 10);
 * // 5
 * console.log(constrain(-1, 1, 10);
 * // 1
 */
export const constrain = (value, left, right) => {
    return value >= left ? (value <= right ? value : right) : left
}
/**
 * Làm tròn đến chữ số thập phân x
 * @param  {Number} number Số bạn muốn làm tròn
 * @param  {Number} amount Số lượng chữ số thập phân (x)
 * @return {Number}        Số được làm tròn chữ số thập phân x
 * @example
 * round(Math.PI, 2);
 * // 3.14
 *
 * @example với cách dùng thứ hai này, code sẽ được đẹp hơn
 * import { round } from "./common.util.js"
 *
 * round(Math.PI, 2)
 * // 3.14
 */
export const round = (number, amount) => {
    return parseFloat(Number(number).toFixed(amount))
}
/**
 * Kế thừa các thuộc tính của 1 object sâu (khác với Object.assign)
 * @param  {Object} object Object kế thừa
 * @param  {Object} deep Object bị kế thừa
 * @return {Object}        Object đã kế thừa
 * @example
 * const obj1 = {
 *  a: {
 *    b: true
 *  }
 * };
 * const obj2 = {
 *  a: {
 *    c: "skybot"
 *  }
 * }
 * extend(a, b);
 * // { a: { b: "skybot", c: true } }
 * }
 */
export const extend = (obj, deep) => {
    let argsStart, deepClone

    if (typeof deep === "boolean") {
        argsStart = 2
        deepClone = deep
    } else {
        argsStart = 1
        deepClone = true
    }

    for (let i = argsStart; i < arguments.length; i++) {
        const source = arguments[i]

        if (source) {
            for (let prop in source) {
                if (deepClone && source[prop] && source[prop].constructor === Object) {
                    if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {}
                        extend(obj[prop], deepClone, source[prop])
                    } else {
                        obj[prop] = source[prop]
                    }
                } else {
                    obj[prop] = source[prop]
                }
            }
        }
    }

    return obj
}
/**
 * Dịch 1 đoạn văn bản thành các arguments (xài minimist để dịch)
 * @param  {String} text         Đoạn văn bản nào đó
 * @param  {String} [specialChar=א] Kí tự đặc biệt để xử lí quote
 * @return {Object}             Arguments
 * @example
 * //Xem ở đây: {@link https://www.npmjs.com/package/minimist} (nhớ CTRL + CLICK)
 */
export const parseArgs = (str, specialChar) => {
    const quotes = ["\"", "'", "`"]
    for (let quote of quotes) {
        let tmp = str.split(quote)
        for (let i = 1; i < tmp.length; i += 2) {
            str = str.replace(
                `${quote}${tmp[i]}`,
                `${tmp[i].replace(/ /g, specialChar)}`
            )
            str = str.replace(quote, "")
        }
    }
    const output = []
    str.split(" ").forEach(word => {
        output.push(word.replace(new RegExp(specialChar, "g"), " "))
    })
    return minimist(output)
}
/**
 * Lấy giá trị trong minimist arguments (Dùng chung với hàm parseArg)
 * @param  {Object} args           Args của minimist
 * @param  {Array} validList       Các trường mà bạn cần lấy giá trị
 * @return {Boolean|String|Number} Giá trị của trường đó
 * @example
 * const args = parseArg("skybot --version -s");
 * parseValue(args, ["version", "v"]);
 * // 1
 * parseValue(args, ["s"]);
 * // TRUE
 */
export const parseValue = (args, validList) => {
    for (const param in args) {
        if (validList.indexOf(param) != -1) {
            const value = args[param]
            return typeof value == "object" ? value[value.length - 1] : value
        }
    }
    return undefined
}
/**
 * Xóa 1 file theo đường dẫn
 * @param  {String} path Đường dẫn tới file
 * @example
 * deleteFile(__dirname + "/test.txt");
 * // *File test.txt sẽ bị xóa*
 */
export const deleteFile = path => {
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(path)
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}
/**
 * Lấy keyword của 1 đoạn tin nhắn
 * @param  {String} text Đoạn tin nhắn của người dùng
 * @return {String}      Keyword của lệnh đó
 * @example
 * getKeyword("/help")
 * // "help"
 * getKeyword("/ytmp3 -s 'Anh yeu em'")
 * // "ytmp3"
 */
export const getKeyword = text => {
    return text
        .split(" ")
        .slice(0, 1)[0]
        .slice(1)
}
/**
 * Tính dung lượng của file (theo mb)
 * @param  {String} path Đường dẫn tới file
 * @return {Number}      Dung lượng của file (mb)
 * @example
 * // file test.txt có dung lượng 1024KB
 * getFileSize(__dirname + "/test.txt");
 * // 1
 */
export const getFileSize = path => {
    let fileSizeInBytes = fs.statSync(path)["size"]
    // Convert the file size to megabytes (optional)
    let fileSizeInMegabytes = fileSizeInBytes / 1000000.0
    return Math.round(fileSizeInMegabytes)
}
/**
 * Lấy tên file bỏ đuôi extension
 * @param  {String} text Tên file
 * @return {String}      Tên file không có đuôi
 * @example
 * subname("test.txt");
 * // "test"
 */
export const subname = text => {
    return text
        .split(".")
        .slice(0, -1)
        .join(".")
}
/**
 * Lấy đuôi file bỏ tên extension
 * @param  {String} text  Tên file
 * @return {String}      Đuôi file
 * @example
 * subname("test.txt");
 * // "test"
 */
export const extname = text => {
    return text
        .split(".")
        .slice(-1)
        .join(".")
}
/**
 * Chuyển 1 số về dạng mật mã đặc biệt (theo bảng chữ cái tiếng anh)
 * @param  {Number} number Số bạn muốn chuyển
 * @return {String}        Mã đặc biệt 1 = "o", 2 = "t",...
 * @example
 * numbersToWords(123);
 * // "oth"
 * numbersToWords(18102004);
 * // "ogoztzzf"
 */
export const numberToPassword = number => {
    const numbers = ["z", "o", "t", "h", "f", "i", "s", "e", "g", "n"]
    let str = number.toString()
    for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(i, "g"), numbers[i])
    }
    return str
}
/**
 *
 * @param  {String|Number} number Định dạng 1 string, number về dạng tiền tệ
 * @return {String}               Tiền tệ
 * @example
 * currencyFormat(1234567);
 * // "1,234,567"
 */
export const currencyFormat = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
/**
 * Lấy dữ liệu của tin nhắn câu lệnh
 * @param  {String} text Lệnh người dùng nhập
 * @return {String}      1 text với keyword đã bị bỏ
 * @example
 * getParam("/help hello, good morning!");
 * // "hello, good morning!"
 */
export const getParam = text => {
    return text
        .split(" ")
        .slice(1)
        .join(" ")
}
/**
 * Loại bỏ các kí tự lạ trong văn bản
 * @param  {String} text Văn bản nào đó
 * @return {String}      Văn bản sạch
 */
export const removeSpecialChar = str => {
    if (str === null || str === "") return false
    else str = str.toString()

    return str.replace(/[^\x20-\x7E]/g, "")
    // return str;
}

/**
 * thực hiện phép lấy giá trị ngẫu nhiên
 * @example
 * import { random } from "./common.util.js";
 *
 * random(1, 10)
 * // trả về giá trị ngẫu nhiên từ 1 đến 10
 *
 * // lưu ý: vì phép ngẫu nhiên này không được làm tròn vì vậy bạn nên dùng random cùng với round
 * @example
 * import { random, round } from "./common.util.js";
 *
 * round(random(1, 10), 2)
 * // trả về giá trị ngẫu nhiên từ 1 đến 10 và được làm chòn đến chữ số thập phân thứ hai
 *
 */
export const random = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start)
}

export const shuffle = arr => {
    // thuật toán bogo-sort
    let count = arr.length,
        temp,
        index

    while (count > 0) {
        index = Math.floor(Math.random() * count)
        count--
        temp = arr[count]
        arr[count] = arr[index]
        arr[index] = temp
    }

    return arr // Bogosort with no điều kiện dừng
}

export const validURL = str => {
    var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
        "i"
    ) // fragment locator
    return !!pattern.test(str)
}

export const convert_to_string_time = (time = 0) => {
    if (time < 0) time = 0

    const hh = Math.floor(time / 1000 / 60 / 60)
    const mm = Math.floor((time - hh * 60 * 60 * 1000) / 1000 / 60)
    const ss = Math.ceil((time - hh * 60 * 60 * 1000 - mm * 60 * 1000) / 1000)
    let text = `${ss}s`
    if (mm > 0) text = `${mm}m ${text}`

    if (hh > 0) text = `${hh}h ${text}`

    return text
}

export const deepEqual = (x, y) => {
    if (x === y) {
        return true
    } else if (
        typeof x == "object" &&
        x != null &&
        typeof y == "object" &&
        y != null
    ) {
        if (Object.keys(x).length != Object.keys(y).length) return false

        for (var prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (!deepEqual(x[prop], y[prop])) return false
            } else return false
        }

        return true
    } else return false
}

export const importJSON = pathToJson => JSON.parse(fs.readFileSync(pathToJson))

export function getCallerFile() {
    let originalFunc = Error.prepareStackTrace
    let callerfile
    try {
        let err = new Error()
        let currentfile
        Error.prepareStackTrace = function (err, stack) {
            return stack
        }
        currentfile = err.stack.shift().getFileName()
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName()
            if (currentfile !== callerfile) break
        }
    } catch { }
    Error.prepareStackTrace = originalFunc
    return callerfile
}
