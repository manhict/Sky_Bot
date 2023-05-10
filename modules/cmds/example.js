/**
* @author SKy - manhG
* @SKyBot Do not edit code or edit credits
*/
export const config = {
    name: 'example',
    version: '1.0.0',
    role: '0',
    author: ['ManhG'],
    category: ['Hệ thống', 'System'],
    viDesc: 'Example.',
    enDesc: 'Example',
    usage: '',
    timestamp: 1,
    packages: ['fs'],
    envConfig: {
        "Example": true
    }
}
export const languages = {
    "vi_VN": {
        "Example": "〉example ?"
    },
    "en_US": {
        "Example": "〉example ?"
    }
}
export async function onLoad({ Config, logger, Threads, Users }) {
    // Code write
}
export async function onEvent({ api, event, message, Config, logger, Threads, Users, getText }) {
    // Code write
}
export async function onMessage({ api, event, message, Config, logger, Threads, Users, args, body, getText }) {
    // Code write
    // getText("Example")   // get Text Thread languages
    // global.getText('LOGIN_YES')   // Get Text Thread System -> languages/vi_VN ? en_US
    // client.throwError(this.config.name)  // throwError
    /* EX: */
    message.send(getText('Example'))
}
export async function onReply({ api, event, message, Config, logger, Threads, Users, args, getText }) {
    // Code write
}
export async function onReaction({ api, event, message, Config, logger, Threads, Users, args, getText }) {
    // Code write
}