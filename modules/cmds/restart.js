export const config = {
    name: 'restart',
    role: 2,
    version: '1.0.0',
    author: ['Sky'],
    viDesc: 'Restart',
    enDesc: 'Restart',
    category: ['Hệ thống', 'System'],
    usages: '',
    timestamp: 0,
};
export function onMessage({ message }) {
    const time = process.uptime();
    return message.reply(`⏳ Restarting...\n${time}`, () => process.exit(1));
}