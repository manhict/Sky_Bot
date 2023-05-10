'use strict';

export const config = {
    name: 'girl',
    version: '1.0.0',
    role: 0,
    author: ['ManhG'],
    viDesc: 'Random ảnh girl.',
    enDesc: 'Random imgs girl',
    category: ["random-img", "random-img"],
    usages: '',
    timestamp: 5
};
import axios from 'axios';
export async function onMessage({ event, api }) {
    const { threadID, messageID } = event;
    try {
        var reply = {
            body: "",
            attachment: (await axios({
                url: (await axios('https://imgs-api.vercel.app/girl?apikey=mk001')).data.url,
                method: "GET",
                responseType: "stream"
            })).data
        }
        return api.sendMessage(reply, threadID, messageID);
    } catch (error) {
        return api.sendMessage("Error, please try again later", threadID, messageID);
    }
}