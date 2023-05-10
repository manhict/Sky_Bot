'use strict';
export const config = {
    name: 'chanle',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'Game chẵn lẽ.',
    enDesc: "Play game chanle",
    category: ['Game', 'Game'],
    usages: "<x> <money>",
    timestamp: 5
}
export async function onMessage({ event, api, Users, args }) {
    function reply(msg) {
        return api.sendMessage(msg, event.threadID, event.messageID);
    }
    const { senderID } = event;
    const board = {
        C: ["C", "C0", "C2", "C4", "C6", "C8"],
        L: ["L", "L1", "L3", "L5", "L7", "L9"]
    };
    const betBox = args[0];

    if (!betBox || ![...board.C, ...board.L].includes(betBox)) return reply("Vui lòng gửi tin nhắn theo cú pháp chanle <ô đặt> <số tiền đặt cược>\nGõ help chanle để xem chi tiết hướng dẫn");

    const moneyBet = parseInt(args[1]);
    const moneyUnit = "coins";
    if (isNaN(moneyBet)) return reply("Tiền cược phải là một con số, cú pháp: chanle <ô đặt> <số tiền cược>");
    // Tỉ lệ thắng và bonus
    const random = Math.floor(Math.random() * 10);
    const WIN = random < 3 ? true : false;
    const BONUS = WIN ? random < 2 ? true : false : false;

    const moneyUser = (await Users.getData(senderID)).money;
    if (moneyBet < 50) return reply("Số tiền cược phải lớn hơn 50 " + moneyUnit);
    if (moneyUser < moneyBet) return reply(`Bạn không đủ tiền để đặt cược\n» Số tiền hiện tại của bạn: ${moneyUser}\n» Số tiền còn thiếu: ${moneyBet - moneyUser} ${moneyUnit}`);

    let responseMoney;
    let result;
    const betBoxOfUser = betBox.slice(0, 1);
    let text;

    if (WIN) {
        responseMoney = moneyBet * 3;
        const boardAfterFilter = board[betBoxOfUser].filter(i => i != betBox);
        console.log(boardAfterFilter);
        text = ["Chúc mừng bạn đã chiến thắng với số tiền", "x3"];

        result = betBox.length == 2 ? boardAfterFilter[Math.floor(Math.random() * boardAfterFilter.length)] : board[betBoxOfUser][Math.floor(Math.random() * board[betBoxOfUser].length)];
        if (BONUS && betBox.length == 2) {
            result = betBox;
            text[1] = "x6";
        }
    } else {
        text = ["Rất tiếc, bạn đã thua và mất số tiền", ""];
        const oppositeBetBox = betBoxOfUser == "L" ? "C" : "L";
        result = board[oppositeBetBox][Math.floor(Math.random() * board[oppositeBetBox].length)];
        if (betBox.length == 1) responseMoney = -moneyBet;
        else if (betBox.length == 2) responseMoney = -moneyBet * 2;
    }

    reply(`» Kết quả là: ${result}\n» ${text[0]} ${text[1]}: ${Math.abs(responseMoney)} ${moneyUnit}\n» Số tiền hiện tại: ${moneyUser + responseMoney} ${moneyUnit}`);
    await Users.setData(senderID, { money: moneyUser + responseMoney });
};