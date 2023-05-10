'use strict';
export const config = {
  name: "checktt",
  version: "1.0.0",
  role: 0,
  author: ["sky"],
  viDesc: "Kiểm tra lượt tương tác trong nhóm",
  enDesc: "Check interaction in group",
  category: ["Nhóm chat", "Group"],
  usages: "[page/all/tag]",
  timestamp: 5,
  envConfig: {
    "maxColumn": 300
  }
}

export const languages = {
  "vi_VN": {
    "all": "\n%1. %2: %3 tin nhắn",
    "mention": "%1 đứng hạng %2 với %3 tin nhắn",
    "myself": "Bạn đứng hạng %1 và đã gửi %2 tin nhắn trong nhóm này",
    "notFound": "Người dùng chưa tương tác trong nhóm này",
    "header": "🎭Độ tương tác trong box🎭\n",
    "footer": "\n\nNhững người không có tên trong danh sách là chưa gửi tin nhắn nào"
  },
  "en_US": {
    "all": "\n%1. %2: %3 messages",
    "mention": "%1 ranks %2 with %3 messages",
    "myself": "You are ranked %1 and have sent %2 messages in this group",
    "notFound": "User has not interacted in this group",
    "header": "🎭Interaction in the box🎭\n",
    "footer": "\n\nThose not on the list have not sent any messages yet"
  }
}

export async function onEvent({ event, api, Threads }) {
  if (event.type == 'message' || event.type == 'message_reply') {
    let { senderID, threadID, isGroup } = event;
    if (!isGroup) return;
    try {
      if (!global.data.allThreadData[threadID]) await Threads.createData(threadID);
      const members = (await Threads.getData(threadID)).members;
      if (!members[senderID]) {
        members[senderID] = {
          id: senderID,
          name: (await api.getUserInfo(senderID)).name,
          nickname: null,
          inGroup: true,
          exp: 1,
          money: 0
        };
        await Threads.setData(threadID, { members });
      } else members[senderID].exp += 1;
      await Threads.increaseMessageCount(threadID);
      await Threads.setData(threadID, { members });

    } catch (err) {
      return //console.error(err.stack)
    }
  }
}
export async function onMessage({ event, args, Threads, message, getText }) {
  const { threadID, senderID, participantIDs } = event;
  const threadData = await Threads.getData(threadID);
  const { members } = threadData;
  const arraySort = [];
  for (let id in members) {
    const count = members[id].exp;
    const name = members[id].name;
    participantIDs.includes(id) ? arraySort.push({ name, count, uid: id }) : "";
  }
  let stt = 1;
  arraySort.sort((a, b) => b.count - a.count);
  arraySort.map(item => item.stt = stt++);

  if (args[0]) {
    if (args[0].toLowerCase() == "all") {
      let msg = getText('header')
      for (const item of arraySort) {
        if (item.count > 0) msg += getText('all', item.stt, item.name, item.count);
      }
      return message.reply(msg + getText('footer'));
    } else if (event.mentions) {
      let msg = "";
      for (const id in event.mentions) {
        const findUser = arraySort.find(item => item.uid == id);
        if (!findUser) return message.reply(getText('notFound'));
        msg += getText('mention', findUser.name, findUser.stt, findUser.exp || 0);
      }
      return message.reply(msg);
    }
  } else {
    if (arraySort.find(item => item.uid == senderID) == undefined) return;
    else return message.reply(getText('myself', arraySort.find(item => item.uid == senderID).stt, members[senderID].exp));
  }
}
