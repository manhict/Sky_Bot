export const config = {
    name: "sleep",
    version: "1.0.1",
    role: 0,
    author: "Sky",
    viDesc: "Tính thời gian đi ngủ hoàn hảo cho bạn",
    enDesc: "sleep time",
    category: ['Sức khỏe', 'Health'],
    usages: "[Time]",
    timestamp: 5
};

export const languages = {
    "vi_VN": {
        "returnTimeNow": "Nếu bạn đi ngủ bây giờ, những thời gian hoàn hảo nhất để thức dậy là:\n%1",
        "returnTimeSet": "Nếu bạn đi ngủ vào lúc %1, những thời gian hoàn hảo nhất để thức dậy là:\n%2"
    },
    "en_US": {
        "returnTimeNow": "If you go to sleep now, the perfect time to wake up is:\n%1",
        "returnTimeSet": "If you go to sleep at %1, perfect times to wake up is:\n%2"
    }
}

import moment from "moment-timezone";

export function onMessage({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const { throwError } = client;

    var wakeTime = [];
    let content = args.join(" ")
    if (!content) {
        for (var i = 1; i < 7; i++) wakeTime.push(moment().tz("Asia/Ho_Chi_Minh").add(90 * i + 15, 'm').format("HH:mm"));
        return api.sendMessage(getText("returnTimeNow", wakeTime.join(', ')), threadID, messageID);
    }
    else {
        if (content.indexOf(":") == -1) return throwError(this.config.name);
        var contentHour = content.split(":")[0];
        var contentMinute = content.split(":")[1];
        if (isNaN(contentHour) || isNaN(contentMinute) || contentHour > 23 || contentMinute > 59 || contentHour < 0 || contentMinute < 0 || contentHour.length != 2 || contentMinute.length != 2) return throwError(this.config.name);
        var getTime = moment().tz("Asia/Ho_Chi_Minh").format();
        var time = getTime.slice(getTime.indexOf("T") + 1, getTime.indexOf("+"));
        var hour = time.split(":")[0];
        var minute = time.split(":")[1];
        var sleepTime = getTime.replace(hour + ":", contentHour + ":").replace(minute + ":", contentMinute + ":");
        for (var i = 1; i < 7; i++) wakeTime.push(moment(sleepTime).tz("Asia/Ho_Chi_Minh").add(90 * i + 15, 'm').format("HH:mm"));
        return api.sendMessage(getText("returnTimeSet", content, wakeTime.join(', ')), threadID, messageID);
    }
}   
