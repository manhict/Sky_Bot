export const config = {
    name: 'flop',
    version: '1.0.0',
    role: 1,
    author: ['Sky'],
    viDesc: 'Xóa tất cả thành viên trong nhóm.',
    enDesc: 'Remove all members in group.',
    category: ['Quản trị nhóm', 'Group management'],
    usages: '',
    timestamp: 5
};

export async function onMessage({ event, api }) {
    const { participantIDs } = event;
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID);
    return api.getThreadInfo(event.threadID, (err, info) => {
        if (err) return api.sendMessage("» Có lỗi xảy ra!", event.threadID);
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
            return api.sendMessage(`» Cần quyền quản trị nhóm\nVui lòng thêm và thử lại!`, event.threadID, event.messageID);
        if (info.adminIDs.some(item => item.id == event.senderID)) {
            setTimeout(function () { api.removeUserFromGroup(botID, event.threadID) }, 300000);
            return api.sendMessage(`» Bắt đầu flop`, event.threadID, async (error, info) => {
                for (let id in listUserID) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    api.removeUserFromGroup(listUserID[id], event.threadID)
                }
            })
        } else return api.sendMessage('» Chỉ quản trị viên nhóm mới có thể sử dụng lệnh này!', event.threadID, event.messageID);
    })
}