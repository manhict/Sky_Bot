export const config = {
    name: "work",
    var: "1.0.1",
    role: 0,
    author: ["Sky"],
    viDesc: "Có làm thì mới có ăn!",
    enDesc: 'Work to earn money!',
    category: ['Tiền bạc', 'Economy'],
    usages: "",
    timestamp: 5,
    envConfig: {
        cooldownTime: 1200000
    }
};

export const languages = {
    "vi_VN": {
        "cooldown": "Bạn đã làm công việc hôm nay, để tránh kiệt sức hãy quay lại sau: %1 phút %2 giây.",
        "rewarded": "Bạn đã làm công việc %1 và kiếm ra được %2$",
        "job1": "bán vé số",
        "job2": "sửa xe",
        "job3": "lập trình",
        "job4": "hack facebook",
        "job5": "đầu bếp",
        "job6": "thợ hồ",
        "job7": "fake taxi",
        "job8": "gangbang người nào đó",
        "job9": "thợ sửa ống nước may mắn  ( ͡° ͜ʖ ͡°)",
        "job10": "streamer",
        "job11": "bán hàng trực tuyến",
        "job12": "nội trợ",
        "job13": 'bán "hoa"',
        "job14": "tìm jav/hentai full 4K",
        "job15": "chơi Yasuo và gánh đội của bạn"
    },
    "en_US": {
        "cooldown": "You have worked today, to avoid exhaustion please come back after: %1 minute(s) %2 second(s).",
        "rewarded": "You did the job: %1 and received: %2$.",
        "job1": "sell lottery tickets",
        "job2": "repair car",
        "job3": "programming",
        "job4": "hack Facebook",
        "job5": "chef",
        "job6": "mason",
        "job7": "fake taxi",
        "job8": "gangbang someone",
        "job9": "plumber ( ͡° ͜ʖ ͡°)",
        "job10": "streamer",
        "job11": "online seller",
        "job12": "housewife",
        "job13": 'sell "flower"',
        "job14": "find jav/hentai code for SkyTeam",
        "job15": "play Yasuo and carry your team"
    }
}

export async function onMessage({ event, api, Users, getText }) {
    let { threadID, messageID, senderID } = event;
    let cooldown = client.envConfig.envCommands[this.config.name].cooldownTime;
    let data = (await Users.getData(senderID)).data || {};
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        var time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);

        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
    } else {
        const job = [
            getText("job1"),
            getText("job2"),
            getText("job3"),
            getText("job4"),
            getText("job5"),
            getText("job6"),
            getText("job7"),
            getText("job8"),
            getText("job9"),
            getText("job10"),
            getText("job11"),
            getText("job12"),
            getText("job13"),
            getText("job14"),
            getText("job15")
        ];
        const amount = Math.floor(Math.random() * 600);
        return api.sendMessage(getText("rewarded", job[Math.floor(Math.random() * job.length)], amount), threadID, async() => {
            await Users.increaseMoney(senderID, parseInt(amount));
            data.workTime = Date.now();
            await Users.setData(event.senderID, { data });
            return;
        }, messageID);
    }
}
