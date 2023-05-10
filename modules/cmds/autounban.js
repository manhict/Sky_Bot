'use strict';
let timeUnban = 1000 * 60 * 15;
export const config = {
    name: 'autounban',
    version: '1.0.0',
    role: 4,
    author: ['Manh’G'],
    viDesc: 'Tự động gỡ cấm người dùng bị ban bot.',
    enDesc: 'Auto unban user banned by bot.',
    category: ['Hỗ trợ', 'Support'],
    usages: '',
    timestamp: 0
};
export const languages = {
    "vi_VN": {
        "reason": "Tự động gỡ cấm người dùng spambot bot sau 15p."
    },
    "en_US": {
        "reason": "Auto unban user banned by bot 15'."
    }
}
export async function onMessage({ event, api, getText }) {
    return api.sendMessage(getText('reason'), event.threadID);
}
export async function onEvent({ event, api, Users }) {
    const { senderID } = event;
    if (senderID == api.getCurrentUserID()) return;

    /* Global */
    let globalBanned = client.userBanned;
    if (globalBanned) {
        for (let idBan of globalBanned) {
            setTimeout(async function () {
                await Users.unBanned(idBan);
            }, timeUnban);
        }
    }

    /* DataJson */
    const dataBanned = await Users.getBanned();
    if (dataBanned) {
        for (let idBan of dataBanned) {
            setTimeout(async function () {
                await Users.unBanned(idBan.id);
            }, timeUnban);
        }
    }
}
