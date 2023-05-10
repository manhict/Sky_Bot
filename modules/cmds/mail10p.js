export const config = {
	name: "mail10p",
	version: "1.0.0",
	role: 0,
	author: ["Sky"],
	viDesc: "Lấy mail ở 10minutemail",
	enDesc: "Get mail from 10minutemail",
	category: ['Tiện ích', 'Utility'],
	usages: "",
	timestamp: 2
};

import axios from "axios";

export async function onMessage({ api, event, args }) {
	if (args[0] == "new") {
		const res = await axios.get(`https://10minutemail.net/address.api.php?new=1`);
		var user = res.data.mail_get_user;
		var host = res.data.mail_get_host;
		var time = res.data.mail_get_time;
		var stime = res.data.mail_server_time;
		var kmail = res.data.mail_get_key;
		var ltime = res.data.mail_left_time;
		var mid = res.data.mail_list[0].mail_id;
		var sub = res.data.mail_list[0].subject;
		var date = res.data.mail_list[0].datetime2;
		return api.sendMessage(`→ Tên mail: ${user}\n→ Host: ${host}\n→ Mail ${user}@${host} (.)com\n→ Thời gian: ${time}\n→ Thời gian ở server: ${stime}\n→ Key: ${kmail}\n→ Thời gian còn lại: ${ltime}s\n→ Mail ID: ${mid}\n→ Nội dung ${sub}\n→ Date: ${date}`, event.threadID, event.messageID)
	}
	else if (args[0] == "list") {
		var list = "@mailkept.com\n@promail1.net\n@rcmails.com\n@relxv.com\n@folllo.com\n@fortuna7.com\n@invecra.com\n@linodg.com\n@awiners.com\n@subcaro.com"
		return api.sendMessage(`Dưới đây là danh sách domain:\n${list}`, event.threadID, event.messageID)
	}
	else if (args[0] == "more") {
		const res = await axios.get(`https://10minutemail.net/address.api.php?more=1`);
		var user = res.data.mail_get_user;
		var host = res.data.mail_get_host;
		var time = res.data.mail_get_time;
		var stime = res.data.mail_server_time;
		var kmail = res.data.mail_get_key;
		var ltime = res.data.mail_left_time;
		var mid = res.data.mail_list[0].mail_id;
		var sub = res.data.mail_list[0].subject;
		var date = res.data.mail_list[0].datetime2;
		return api.sendMessage(`→ Tên Mail: ${user}\n→ Host: ${host}\n→ Mail ${user}@${host} (.)com\n→ Thời gian: ${time}\n→ Thời gian ở server: ${stime}\n=> Key: ${kmail}\n→ Thời gian còn lại: ${ltime}s\n→ Mail ID: ${mid}\n→ Nội dung ${sub}\n→ Date: ${date}`, event.threadID, event.messageID)
	}
	else if (args[0] == "get") {
		var get = await axios.get(`https://10minutemail.net/address.api.php`)
		var data = get.data
		var mail = data.mail_get_mail,
			id = data.session_id,
			url = data.permalink.url,
			key_mail = data.permalink.key
		let urlMail = url.replace(/\./g, ' . ')
		let maill = mail.replace(/\./g, ' . ')
		return api.sendMessage(`→ Email: ${maill}\n→ ID Mail: ${id}\n→ URL Mail: ${urlMail}\n→ Key Mail: ${key_mail}`, event.threadID, event.messageID)
	}
	else if (args[0] == "check") {
		var get = await axios.get(`https://10minutemail.net/address.api.php`)
		var data = get.data.mail_list[0]
		var email = get.data.mail_get_mail
		var id = data.mail_id,
			from = data.from,
			subject = data.subject,
			time = data.datetime2
		let formMail = from.replace(/\./g, ' . ')
		let maill = email.replace(/\./g, ' . ')
		return api.sendMessage(`→ Email: ${maill}\n→ ID Mail: ${id}\n→ From: ${formMail}\n→ Tiêu đề: ${subject}\n→ Thời gian: ${time}`, event.threadID, event.messageID)
	}
	else if (args.join() == "") {
		return api.sendMessage(`[ NEW ] → Tạo mail mới\n
[ CHECK ] → Check hộp thư đến mail\n
[ GET ] → Lấy mail hiện tại\n\n
→ Bạn có thể click vào URL mail và nhập Key Mail để xem nội dung mail`, event.threadID, event.messageID)
	}
}