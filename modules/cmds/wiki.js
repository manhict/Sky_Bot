export const config = {
    name: 'wiki',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Tìm mọi thông tin cần biết thông qua Wikipedia.',
    enDesc: 'Search information on Wikipedia.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 0,
    packages: ['wikijs']
};

import wikijs from "wikijs"

export const languages = {
    "vi_VN": {
        "missingInput": "Nội dung cần tìm kiếm không được để trống!",
        "returnNotFound": "Không tìm thấy nội dung %1"
    },
    "en_US": {
        "missingInput": "Enter what you need to search for.",
        "returnNotFound": "Can't find %1"
    }
}

export async function onMessage({ event, args, api, getText }) {
    // const wiki = wikijs.default;
    let content = args.join(" ");
    let url = 'https://vi.wikipedia.org/w/api.php';
    if (args[0] == "en") {
        url = 'https://en.wikipedia.org/w/api.php';
        content = args.slice(1, args.length);
    }
    if (!content) return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);
    wikijs({ apiUrl: url }).page(content)
    .catch(() => api.sendMessage(getText("returnNotFound", content), event.threadID, event.messageID))
    .then(page => (typeof page != 'undefined') ? Promise.resolve(page.summary())
    .then(val => api.sendMessage(val, event.threadID, event.messageID)) : '');
}
