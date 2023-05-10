export const config = {
	name: "kick",
	version: "1.0.0", 
	role: 1,
	author: "Sky",
	viDesc: "Xoá người bạn cần xoá khỏi nhóm bằng cách tag",
	category: ['Quản trị nhóm', 'Group management'], 
	usages: "[tag or reply]", 
	timestamp: 0,
};

export const languages = {
	"vi_VN": {
		"error": "Đã có lỗi xảy ra, vui lòng thử lại sau",
		"needPermssion": "Cần quyền quản trị viên nhóm\nVui lòng thêm và thử lại!",
		"missingTag": "Bạn phải tag hoặc reply người cần kick"
	},
	"en_US": {
		"error": "Error! An error occurred. Please try again later!",
		"needPermssion": "Need group admin\nPlease add and try again!",
		"missingTag": "You need tag or reply some person to kick"
	}
}

export async function onMessage({ api, event, getText, Threads }) {
  try {
    if (args.join().indexOf('@') !== -1) {
        var mention = Object.keys(event.mentions);
        for (let o in mention) {
            setTimeout(() => {
                return api.removeUserFromGroup(mention[o], event.threadID, async function(err) {
                    if (err) return api.sendMessage(getText('needPermssion'), event.threadID, event.messageID);
                    return
                })
            }, 1000)
        }
    } else {
        if (event.type == "message_reply") {
            return api.removeUserFromGroup(event.messageReply.senderID, event.threadID, async function(err) {
                if (err) return api.sendMessage(getText('needPermssion'), event.threadID, event.messageID);
                return
            })
        } else {
            if (!args[0]) return api.sendMessage(getText('missingTag'), event.threadID, event.messageID)
        }
    }
  } catch { return api.sendMessage(getText("error"), event.threadID) }
}
