'use strict';
export const config = {
    name: 'listacp',
    ver: '1.0.0',
    role: 3,
    author: ['Sky'],
    viDesc: 'Đồng ý/huỷ lời mời kết bạn.',
    enDesc: 'Accept/reject friend request.',
    category: ['Hệ thống', 'System'],
    usages: "[add | del] [stt | all]",
    timestamp: 5
}

export const languages = {
    "vi_VN": {
        "replyContent": "〉%1\nReply tin nhắn này với nội dung: <add | del> <số thứ tự | hoặc \"all\"> để thực hiện hành động",
        "chooseAction": "〉Vui lòng chọn <add | del > <số thứ tự | hoặc all>",
        "noStt": "〉Không tìm thấy stt %1 trong danh sách",
    },
    "en_US": {
        "replyContent": "〉%1\n Reply to this message with: <add | del> <order number | or \"all\"> to take action",
        "selectAction": "〉 Please select <add | del> <order number | or all>",
        "noStt": "〉 Stt %1 not found in list",
    }
}

export async function onReply({ reply, event, api, getText }) {
    const { author, listRequest } = reply;
    if (author != event.senderID) return;
    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    const form = {
        av: api.getCurrentUserID(),
        fb_api_caller_class: "RelayModern",
        variables: {
            input: {
                source: "friends_tab",
                actor_id: api.getCurrentUserID(),
                client_mutation_id: Math.round(Math.random() * 19).toString()
            },
            scale: 3,
            refresh_num: 0
        }
    };

    const success = [];
    const failed = [];

    if (args[0] == "add") {
        form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
        form.doc_id = "3147613905362928";
    } else if (args[0] == "del") {
        form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
        form.doc_id = "4108254489275063";
    } else return api.sendMessage(getText("chooseAction"), event.threadID, event.messageID);
    let targetIDs = args.slice(1);

    if (args[1] == "all") {
        targetIDs = [];
        const lengthList = listRequest.length;
        for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
        const u = listRequest[parseInt(stt) - 1];
        if (!u) {
            failed.push(getText('noStt', stt));
            continue;
        }
        form.variables.input.friend_requester_id = u.node.id;
        form.variables = JSON.stringify(form.variables);
        newTargetIDs.push(u);
        promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
        form.variables = JSON.parse(form.variables);
    }

    const lengthTarget = newTargetIDs.length;
    for (let i = 0; i < lengthTarget; i++) {
        try {
            const friendRequest = await promiseFriends[i];
            if (JSON.parse(friendRequest).errors) failed.push(newTargetIDs[i].node.name);
            else success.push(newTargetIDs[i].node.name);
        } catch (e) {
            failed.push(newTargetIDs[i].node.name);
        }
    }

    api.sendMessage(`» Đã ${args[0] == 'add' ? 'chấp nhận' : 'xóa'} lời mời kết bạn thành công của ${success.length} người:\n${success.join("\n")}${failed.length > 0 ? `\n» Thất bại với ${failed.length} người: ${failed.join("\n")}` : ""}`, event.threadID, event.messageID);
}

export async function onMessage({ event, api, getText }) {
    const dateTime = global.utils.getTimeZone();
    const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
        fb_api_caller_class: "RelayModern",
        doc_id: "4499164963466303",
        variables: JSON.stringify({ input: { scale: 3 } })
    };
    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
    let msg = "";
    let i = 0;
    for (const user of listRequest) {
        i++;
        msg += (`\n${i}. Name: ${user.node.name}`
            + `\nID: ${user.node.id}`
            + `\nUrl: ${user.node.url.replace("www.facebook", "fb")}`
            + `\nTime: ${dateTime}\n`);
    }
    api.sendMessage(getText("replyContent", msg), event.threadID, (e, info) => {
        client.reply.push({
            name: this.config.name,
            messageID: info.messageID,
            listRequest,
            author: event.senderID
        });
    }, event.messageID);
}
