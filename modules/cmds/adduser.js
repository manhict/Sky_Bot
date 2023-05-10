'use strict';
export const config = {
    name: 'adduser',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Thêm thành viên bằng url hoặc uid.',
    enDesc: 'Add user by url or uid.',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '',
    timestamp: 5
};
export const languages = {
    "vi_VN": {
        "Exist": "〉Người này đã có trong nhóm của bạn",
        "addError": "〉Không thể thêm người dùng vào cuộc trò chuyện. Vui lòng thử lại sau.",
        "Approve": "〉Đã thêm người này vào danh sách phê duyệt",
        "addSuccess": "〉Thêm thành viên mới thành công!",
        "idErr": "〉Đã xảy ra lỗi khi lấy id người dùng"
    },
    "en_US": {
        "Exist": "〉This person is already in your group",
         "addError": "〉Unable to add user to chat. Please try again later.",
         "Approve": "〉Added this person to the approval list",
         "addSuccess": "〉New member added success!",
         "idErr": "〉There was an error retrieving the user id"
    }
}
export async function onMessage({ event, api, Config, message, Threads, Users, args, getText }) {
    let uid;
    if(event.isGroup == false) return;
    const linkurl = (args.join(" ")).trim();
    if(linkurl == '') return;
    const botID = api.getCurrentUserID();
    if (isNaN(args[0])) {
        try {
            uid = (await api.findUID(args[0]));
        } catch (err) {
            return message.reply(getText("idErr"));
        }
    } else uid = args[0];

    let threadInfo = await api.getThreadInfo(event.threadID);
    if (threadInfo.participantIDs.includes(uid)) {
        return message.reply(getText("Exist"));
    } else {
        api.addUserToGroup(uid, event.threadID, (err) => {
            if (err) return message.reply(getText("addErr"));
            else if (threadInfo.approvalMode && !threadInfo.adminIDs.includes(botID)) 
                 return message.reply(getText("Approve"));
            else return message.reply(getText("addSuccess"));
        });
    }

}