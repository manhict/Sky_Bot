export const config = {
    name: "antiout",
    version: "1.0.0",
    credits: "Sky",
    eventType: ["log:unsubscribe"],
    viDesc: "Anti-out",
    enDesc: "Anti-out"
};

import { resolve } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const path = resolve(process.cwd(), 'caches', 'antiout.json');

export const languages = {
    "vi_VN": {
        "antioutAdd": "%1 Đã cố gắng trốn thoát khỏi nhóm nhưng không thành và đã bị bắt lại.",
        "antioutError": "Không thể thêm %1 vừa out vào lại nhóm."
    },
    "en_VN": {
        "antioutAdd": "%1 tried to leave the group but was caught and added back.",
        "antioutError": "Tried to leave the group but was caught and added back."
    }
}

export async function onMessage({ api, event, Users, getText }) {
    const { antiout } = require(path);
    const { logMessageData, author, threadID } = event;
    const id = logMessageData.leftParticipantFbId;
    if (id == api.getCurrentUserID()) return;
    if (author == id) {
        const name = await Users.getName(id) || "Người dùng Facebook";
        if (antiout.hasOwnProperty(threadID) && antiout[threadID] == true) {
            try {
                await api.addUserToGroup(id, threadID);
                return api.sendMessage(getText('antioutAdd', name), threadID);
            }
            catch (e) {
                return api.sendMessage(getText('antioutError', name), threadID);
            }
        }
    }
    return;
}