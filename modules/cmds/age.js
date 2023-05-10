export const config = {
    name: "age",
    version: "1.0.0",
    role: 0,
    author: ["Khoa"],
    viDesc: "Tính tuổi",
    enDesc: "Calculate age",
    category: ["Tiện ích", "Utility"],
    usages: "[dd/mm/yyyy]",
    timestamp: 0
}

import moment from "moment-timezone";

export const languages = {
    "vi_VN": {
        "input": "〉Vui lòng nhập đúng format %1%2 [ngày/tháng/năm sinh]",
        "ddError": "〉Ngày sinh không hợp lệ!",
        "mmError": "〉Tháng sinh không hợp lệ!",
        "yyyyError": "〉Năm sinh không hợp lệ!",
        "output": "〉Ngày tháng năm sinh: %1\n\n-Số năm đã qua: %2 năm \n-Số tháng đã qua: %3 tháng \n-Số tuần đã qua: %4 tuần \n-Số ngày đã qua: %5 ngày \n-Số giờ đã qua: %6 giờ \n-Số phút đã qua: %7 phút \n-Số giây đã qua: %8 giây"
    },
    "en_US": {
        "input": "〉Please enter the correct format %1%2 [date/month/year of birth]",
        "ddError": "〉Invalid date of birth!",
        "mmError": "〉Invalid birth month!",
        "yyyyError": "〉Invalid birth year!",
        "output": "〉Date of birth: %1\n\n-Number of years passed: %2 years \n-Number of months passed: %3 months \n-Number of weeks passed: %4 weeks \n -Number of days elapsed: %5 days \n-Elapsed hours: %6 hours \n-Elapsed minutes: %7 minutes \n-Elapsed seconds: %8 seconds"
    }
}

export async function onMessage({ event, args, api, Threads, getText }) {
    const threadSetting = await Threads.getData(event.threadID) || {};
    var prefix = threadSetting.prefix || client.config.PREFIX;
    var input = args[0];
    if (!input) return api.sendMessage(getText('input', prefix, this.config.name), event.threadID, event.messageID);
    var cc = input.split("/");
    var ngay1 = parseInt(cc[0]);
    if (!ngay1 || isNaN(ngay1) || ngay1 > 31 || ngay1 < 1) return api.sendMessage(getText('ddError'), event.threadID, event.messageID);
    var thang1 = parseInt(cc[1]);
    if (!thang1 || isNaN(thang1) || thang1 > 12 || thang1 < 1) return api.sendMessage(getText("mmError"), event.threadID, event.messageID);
    var nam1 = parseInt(cc[2]);
    if (!nam1) return api.sendMessage(getText("yyyyError"), event.threadID, event.messageID);

    var hientai = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
    var concac = `${hientai}`;
    var djtme = concac.split(" ");
    var dm = djtme[0].split("/");
    var ngay2 = parseInt(dm[0]);
    var thang2 = parseInt(dm[1]);
    var nam2 = parseInt(dm[2]);
    var ngay3 = ngay2 - ngay1;
    var thang3 = thang2 - thang1;
    var nam3 = nam2 - nam1;
    var duma = djtme[1].split(":");
    var hh = parseInt(duma[0]);
    var mm = parseInt(duma[1]);
    var ss = parseInt(duma[2]);
    var nam = nam3 + Math.round(thang3 / 12 * 100) / 100;
    var xthang = nam * 12 + thang3 + ngay1 / 31;
    var thang = Math.round(xthang * 100) / 100;
    var dcm = thang / 36;
    var tuan = Math.round(thang * 4 * 100) / 100;
    var xngay = (xthang * 31 + xthang * 30) / 2 - dcm * 3 / 2 + ngay3 + hh / 24;
    var wtf = (xthang * 31 + xthang * 30) / 2 - dcm * 3 / 2 + ngay3;
    var ngay = Math.round(xngay * 100) / 100;
    var gio = Math.round((wtf * 24 + hh) * 100) / 100;
    var xphut = gio * 60 + mm + ss / 60;
    var phut = Math.round(xphut * 100) / 100;
    var giay = Math.round((phut * 60 + ss) * 100) / 100;
    // Nỗ não :>
    return api.sendMessage(getText("output", input, nam, thang, tuan, ngay, gio, phut, giay), event.threadID, event.messageID)
}
