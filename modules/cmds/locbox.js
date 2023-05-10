'use strict';
export const config = {
  name: 'locbox',
  version: '1.0.0',
  role: 2,
  author: ['Sky'],
  viDesc: 'Lọc box theo số thành viên.',
  enDesc: 'Box less than members.',
  category: ['Hệ thống', 'System'],
  usages: '<number>',
  timestamp: 5
};
export async function onMessage({ event, api, args, getText }) {
  try {
    var inbox = await api.getThreadList(100, null, ['INBOX']);
    let list = [...inbox].filter(group => group.isSubscribed && group.isGroup && group.threadID != event.threadID);
    var listbox = [];
    var lengthID = []
    var members = args[0] || 20;
    if (!parseInt(args[0])) return api.sendMessage('Vui lòng nhập 1 số!', event.threadID, event.messageID)
    for (var groupInfo of list) {
      if (groupInfo.participants.length < members) {
        lengthID.push(groupInfo.threadID)
        api.removeUserFromGroup(api.getCurrentUserID(), groupInfo.threadID)
      }
      else return api.sendMessage(`Không có box nào dưới ${members} thành viên\n`, event.threadID)
    }
    return api.sendMessage(`Đã lọc thành công ${lengthID.length} box dưới ${members} thành viên\n`, event.threadID, event.messageID)
  } catch (error) {
    console.log(error);
  }
}
