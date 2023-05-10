export const config = {
	name: "trans",
	version: "1.0.0",
	role: 0,
	author: ["Sky"],
	viDesc: "Dịch văn bản",
	enDesc: "Trans trans",
	category: ['Tiện ích', 'Utility'],
	usages: "[en/ko/ja/vi] [Text]",
	timestamp: 2,
	packages: ["request"]
};

import request from 'request';

export const languages = {
	"vi_VN": {
		"message": "〉Bản dịch: %1\n - được dịch từ %2 sang %3.",
		"error": "〉Đã có lỗi xảy ra!"
	},
	"en_US": {
		"message": "〉Translation: %1\n - translated from %2 to %3.",
		"error": "〉An error occurred!"
	}
}

export async function onMessage({ api, event, args, getText }) {
	var content = args.join(" ");
	if (content.length == 0 && event.type != "message_reply") return client.throwError(this.config.name);
	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body
		if (content.indexOf("-> ") !== -1) lang = content.substring(content.indexOf("-> ") + 3);
		else lang = global.data.allThreadData[event.threadID].language ? (global.data.allThreadData[event.threadID].language).slice(0, 2) : "vi";
	}
	else if (content.indexOf(" -> ") == -1) {
		translateThis = content.slice(0, content.length)
		lang = global.data.allThreadData[event.threadID].language ? (global.data.allThreadData[event.threadID].language).slice(0, 2) : "vi";
	}
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage(getText('error'), event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
		var fromLang = (retrieve[2] === retrieve[8][0][0]) ? retrieve[2] : retrieve[8][0][0]
		api.sendMessage(getText('message', text, fromLang, lang), event.threadID, event.messageID);
	});
}
