// 'use strict';
//Code by manhG. Facebook: Fb.com/manhict. Copyright by Sky. All rights reserved.
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import threadsModels from '../models/threadsModel.js'
import usersModels from '../models/usersModel.js';
import { createRequire } from "module"
const require = createRequire(import.meta.url)

export default async function ({ api, logger }) {
    const { config } = global.client;
    let moment = global.utils.getTimeZone();
    const pathDataThread = join(client.dirMain, '/src/database/dataJson/', 'threads.json');
    const pathDataUser = join(client.dirMain, '/src/database/dataJson/', 'users.json');
    const databaseType = config.DATABASE.type;

    let Threads = {},
        Users = {};
    if (databaseType == 'mongodb') {
        Threads = (await threadsModels.find({ type: 'thread' }))[0].data || {};
        Users = (await usersModels.find({ type: 'user' }))[0].data || {};
        global.data.allThreadData = Threads;
        global.data.allUserData = Users;
    } else {
        if (!existsSync(pathDataThread)) {
            writeFileSync(pathDataThread, JSON.stringify(Threads, null, 2));
        }
        if (!existsSync(pathDataUser)) {
            writeFileSync(pathDataUser, JSON.stringify(Users, null, 2));
        }
        Threads = require(pathDataThread);
        Users = require(pathDataUser);
    }
    global.data.allThreadData = Threads;
    global.data.allUserData = Users;

    async function saveData(Tid) {
        if (databaseType == "mongodb") {
            await threadsModels.updateOne({
                type: "thread"
            }, {
                data: Threads
            })
                .catch(err => logger.error("Đã xảy ra lỗi khi cập nhật dữ liệu của nhóm mang TID: " + Tid + "\n" + err, "MONGODB"));
            global.data.allThreadData = Threads;
        } else {
            global.data.allThreadData = Threads;
            writeFileSync(pathDataThread, JSON.stringify(Threads, null, 2));
        }
    }

    async function saveDataUser(id) {
        if (databaseType == 'mongodb') {
            await usersModels.updateOne({ type: "user" }, {
                data: Users
            })
                .catch(err => logger.error("Đã xảy ra lỗi khi cập nhật dữ liệu của người dùng mang ID: " + id + "\n" + err, "MONGODB"));
            global.data.allUserData = Users;
        } else {
            global.data.allUserData = Users;
            writeFileSync(pathDataUser, JSON.stringify(Users, null, 2));
        }
    }

    async function createData(threadID, callback) {
        try {
            if (isNaN(threadID) && threadID < 4 || !threadID) throw new Error('threadID không hợp lệ');
            if (Threads[threadID]) return;
            const threadInfo = await api.getThreadInfo(threadID);
            if (global.data.allThreadID.includes(threadID)) return;
            // if (threadInfo.isGroup == false) return;
            const name = threadInfo.threadName;
            const { userInfo } = threadInfo;
            const newadminsIDs = [];
            threadInfo.adminIDs.forEach(item => newadminsIDs.push(item.id));

            const newMembers = {};
            for (let user of userInfo) {
                const senderID = user.id;
                const dataUser = {
                    id: senderID,
                    name: user.name,
                    nickname: threadInfo.nicknames[senderID] || null,
                    inGroup: true,
                    exp: 0,
                    money: 0
                };
                newMembers[senderID] = dataUser;
            }

            const data = {
                id: threadID,
                name: name,
                emoji: threadInfo.emoji,
                prefix: null,
                language: null,
                adminIDs: newadminsIDs,
                approvalMode: threadInfo.approvalMode,
                status: true,
                banned: {
                    status: false,
                    reason: null,
                    time: null
                },
                data: {
                    onlyQTV: false
                },
                avatar: threadInfo.imageSrc,
                messageCount: threadInfo.messageCount,
                numberMember: threadInfo.participantIDs.length,
                members: newMembers
            };
            Threads[threadID] = data;
            await saveData(threadID);
            global.data.allThreadID.push(threadID);
            if (callback && typeof callback == "function") callback(null, Threads[threadID]);

            if (databaseType == 'mongodb') {
                Users = (await usersModels.find({ type: 'user' }))[0].data || {};
            }
            global.data.allUserData = Users;
            for (let i of userInfo) {
                if (!global.data.allUserData[i.id]) {
                    if (!i.vanity) var vanity = 'profile.php?id=' + i.id;
                    else var vanity = i.vanity;
                    if (i.gender == 2) var gender = 'MALE';
                    else var gender = 'FEMALE';
                    if (i.type == 'UnavailableMessagingActor') var status = false;
                    else var status = true;
                    var profileUrl = 'https://www.facebook.com/' + vanity;
                    var add_user = {
                        id: i.id,
                        name: i.name,
                        firstName: i.firstName,
                        vanity: i.vanity || '',
                        gender: gender,
                        type: i.type,
                        profileUrl,
                        exp: 0,
                        money: 0,
                        status: status,
                        banned: {
                            status: false,
                            reason: null,
                            time: null
                        },
                        data: {},
                        avatar: `https://graph.facebook.com/${i.id}/picture?height=1500&width=1500&access_token=${config.accessToken}`
                    };
                    Users[i.id] = add_user;
                    await saveDataUser(i.id);
                    global.data.allUserID.push(i.id);

                    logger.log(
                        '\x1b[1;36mNew User: \x1b[1;37m' +
                        i.id +
                        ' | \x1b[1;31m' +
                        i.name +
                        '\x1b[37m',
                        'user'
                    );
                }
            }
            return data;
        } catch (err) {
            logger.error(err.stack || err, 'CREATE THREAD DATA');
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function refreshInfo(threadID, callback) {
        try {
            if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
            if (!Threads[threadID]) throw new Error(`Nhóm mang id threadID} không tồn tại trong database`);
            const ThreadInfo = await getData(threadID) || {};
            const newThreadInfo = await api.getThreadInfo(threadID);
            const newadminsIDs = [];
            newThreadInfo.adminIDs.forEach(item => newadminsIDs.push(item.id));
            const { userInfo } = newThreadInfo;
            const oldMembers = ThreadInfo.members;
            const newMembers = {};
            for (let user of userInfo) {
                const senderID = user.id;
                const oldDataUser = oldMembers[senderID];
                const data = {
                    id: user.id,
                    name: user.name,
                    nickname: newThreadInfo.nicknames[senderID],
                    exp: oldMembers[senderID] ? oldMembers[senderID].exp : 0,
                    money: oldMembers[senderID] ? oldMembers[senderID].money : 0
                };
                newMembers[senderID] = { ...oldDataUser, ...data };
            }

            ThreadInfo.name = newThreadInfo.name;
            ThreadInfo.emoji = newThreadInfo.emoji;
            ThreadInfo.prefix;
            ThreadInfo.language;
            ThreadInfo.adminIDs = newadminsIDs;
            ThreadInfo.approvalMode = newThreadInfo.approvalMode;
            ThreadInfo.status;
            ThreadInfo.banned;
            ThreadInfo.data;
            ThreadInfo.avatar = newThreadInfo.imageSrc;
            ThreadInfo.numberMember = newThreadInfo.participantIDs.length;
            ThreadInfo.messageCount = newThreadInfo.messageCount;
            ThreadInfo.members = newMembers;

            Threads[threadID] = ThreadInfo;

            await saveData(threadID);

            if (databaseType == 'mongodb') {
                Users = (await usersModels.find({ type: 'user' }))[0].data || {};
            }
            global.data.allUserData = Users;
            for (let i of userInfo) {
                const InfoUser = await Users[i.id];
                if (!i.vanity) var vanity = 'profile.php?id=' + i.id;
                else var vanity = i.vanity;
                if (i.type == 'UnavailableMessagingActor') var status = false;
                else var status = true;
                var profileUrl = 'https://www.facebook.com/' + vanity;
                var add_user = {
                    id: i.id,
                    name: i.name,
                    firstName: i.firstName,
                    vanity: i.vanity,
                    gender: i.gender,
                    type: i.type,
                    profileUrl: profileUrl,
                    money: InfoUser.money,
                    exp: InfoUser.exp,
                    status: status,
                    banned: InfoUser.banned,
                    data: InfoUser.data,
                    avatar: `https://graph.facebook.com/${i.id}/picture?height=1500&width=1500&access_token=${config.accessToken}`
                };
                Users[i.id] = add_user;
                await saveDataUser(i.id);
                //global.data.allUserID.push(i.id);

                logger.log(
                    '\x1b[1;36mNew User: \x1b[1;37m' +
                    i.id +
                    ' | \x1b[1;31m' +
                    i.name +
                    '\x1b[37m',
                    'user'
                );
            }

            if (callback && typeof callback == "function") callback(null, Threads[threadID]);
            return Threads[threadID];
        } catch (err) {
            logger.error(err.stack || err, 'REFRESH THREAD DATA');
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getInfo(threadID, callback) {
        try {
            if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
            const data = await api.getThreadInfo(threadID);
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET INFO THREAD");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getAll(callback) {
        try {
            const data = Threads;
            if (callback && typeof callback == 'function') callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, 'GETALL THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function getKey(keys, callback) {
        try {
            if (!keys) return Threads;
            if (!Array.isArray(keys))
                throw new Error('Tham số truyền vào phải là 1 array');
            const data = [];
            for (let threadID in Threads) {
                const db = { id: threadID };
                const dataT = Threads[threadID];
                for (let key of keys) db[key] = dataT[key];
                data.push(db);
            }
            if (callback && typeof callback == 'function') callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, 'GETKEY DATA THREAD');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function getData(threadID, callback) {
        try {
            if (!Threads[threadID]) throw new Error(`threadID: ${threadID} không tồn tại trong database`);
            const data = Threads[threadID];
            if (callback && typeof callback == 'function')
                callback(null, data);
            return data;
        } catch (err) {
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function setData(threadID, options, callback) {
        try {
            if (!threadID) throw new Error('threadID không được để trống');
            if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
            if (typeof options != 'object')
                throw new Error('Tham số options truyền vào phải là 1 object');
            Threads[threadID] = { ...Threads[threadID], ...options };
            await saveData(Threads);
            if (callback && typeof callback == 'function') callback(null, Threads[threadID]);
            return Threads[threadID];
        } catch (err) {
            logger.error(err.stack || err, 'SET THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function getBanned(threadID, callback) {
        try {
            if (threadID) {
                if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
                const dataThread = await getData(threadID) || {};
                const dataBanned = dataThread.banned || {};
                if (dataBanned.status == true) {
                    const data = { id: dataThread.id, Name: dataThread.name, Reason: dataBanned.reason, Time: dataBanned.time };
                    if (callback && typeof callback == 'function') callback(null, data);
                    return data;
                } else {
                    throw new Error(`Nhóm mang id ${threadID} không bị ban từ trước`);
                }
            } else {
                var threadData = await getKey(["id", "name", "banned"]);
                var listBanned = [],
                    listBan = [],
                    threadArray = [],
                    i = 1,
                    ij = i++;
                for (let groupInfo of threadData) {
                    if (groupInfo.banned != undefined) {
                        if (groupInfo.banned.status == true) {
                            listBanned.push({
                                idThread: groupInfo.id,
                                nameThread: groupInfo.name || "Noname",
                                reason: groupInfo.banned.reason,
                                time: groupInfo.banned.time
                            });
                        }
                    }
                }
                var listBan = listBanned.sort((a, b) => {
                    if (a.time > b.time) return -1;
                    if (a.time < b.time) return 1;
                });
                for (var thread of listBan) {
                    threadArray.push({ id: thread.idThread, name: thread.nameThread, reason: thread.reason, time: thread.time });
                }
                if (callback && typeof callback == 'function') callback(null, msg);
                return threadArray;
            }
        } catch (err) {
            logger.error(err.stack || err, 'GET BANNED THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function setBanned(threadID, reason, callback) {
        try {
            if (!threadID) throw new Error('threadID không được để trống');
            if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
            if (!reason) throw new Error('Lý do cấm nhóm không được để trống');
            const dataBanned = (await getData(threadID)).banned || {};
            if (dataBanned.status == true) throw new Error(`Nhóm mang id ${threadID} đã bị ban từ trước`);
            dataBanned.status = true,
                dataBanned.reason = reason || null,
                dataBanned.time = moment;
            const data = await setData(threadID, { banned: dataBanned });
            if (callback && typeof callback == 'function') callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, 'SET BANNED THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function unBanned(threadID, callback) {
        try {
            if (!threadID) throw new Error('threadID không được để trống');
            if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
            const dataBanned = (await getData(threadID)).banned || {};
            if (dataBanned.status == false) throw new Error(`Nhóm mang id ${threadID} không bị ban từ trước`);
            dataBanned.status = false,
                dataBanned.reason = null,
                dataBanned.time = null;
            const data = await setData(threadID, { banned: dataBanned });
            if (callback && typeof callback == 'function') callback(null, dataBanned);
            return dataBanned;
        } catch (err) {
            logger.error(err.stack || err, 'UN BANNED THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function delData(threadID, callback) {
        try {
            delete Threads[threadID];
            await saveData(threadID);
            if (callback && typeof callback == 'function')
                callback(null, 'DELDATA THREAD ' + threadID + ' SUCCES');
            return true;
        } catch (err) {
            logger.error(err.stack || err, 'DEL THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function getUser(threadID, senderID, callback) {
        try {
            const { members } = await getData(threadID) || {};
            if (!members) {
                members[senderID] = {
                    id: senderID,
                    name: (await api.getUserInfo(senderID)).name || "Người dùng facebook",
                    nickname: null,
                    inGroup: true,
                    exp: 0,
                    money: 0
                };
            }
            const dataUser = await members[senderID];
            if (callback && typeof callback == 'function') callback(null, dataUser);
            return dataUser;
        } catch (err) {
            logger.error(err.stack || err, 'GET USER THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function setUser(threadID, senderID, options, callback) {
        try {
            if (!threadID) throw new Error('threadID không được để trống');
            if (!senderID) throw new Error('senderID không được để trống');
            if (isNaN(threadID)) throw new Error('threadID không hợp lệ');
            if (isNaN(senderID)) throw new Error('senderID không hợp lệ');
            if (typeof options != 'object') throw new Error('Tham số options truyền vào phải là 1 object');
            const { members } = await getData(threadID) || {};
            if (!members) throw new Error(`Người dùng mang ID: ${senderID} không tồn tại trong database`);
            var keys = Object.keys(options);
            for (let key of keys) members[senderID][key] = options[key];
            await saveData(threadID);
            if (callback && typeof callback == 'function') callback(null, members[senderID]);
            return members[senderID];
        } catch (err) {
            logger.error(err.stack || err, 'SET USER THREAD DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function getName(threadID, callback) {
        try {
            const objData = await getData(threadID) || {};
            if (!objData) throw new Error(`threadID: ${threadID} không tồn tại trong database`);
            const data = objData.name || threadID;
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET NAME THREAD");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setName(threadID, content, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) throw new Error(`Nhóm mang ID: ${threadID} không tồn tại trong database`);
            let data = (await getData(threadID)).name;
            await setData(threadID, { name: content });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET NAME THREAD ");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getStatus(threadID, callback) {
        try {
            const dataThread = await getData(threadID) || {};
            if (!dataThread) throw new Error(`threadID: ${threadID} không tồn tại trong database`);
            const data = dataThread.status;
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET STATUS THREAD");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setStatus(threadID, content, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) await createData(threadID)
            if (!Threads[threadID]) throw new Error(`Nhóm mang ID: ${threadID} không tồn tại trong database`);
            let data = (await getData(threadID)).status;
            await setData(threadID, { status: content });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET STATUS THREAD ");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getPrefix(threadID, callback) {
        try {
            const dataUser = await getData(threadID) || {};
            if (!dataUser) throw new Error(`threadID: ${threadID} không tồn tại trong database`);
            const data = dataUser.prefix || global['client']['config']['PREFIX'];
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET PREFIX THREAD");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setPrefix(threadID, content, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) throw new Error(`Nhóm mang ID: ${threadID} không tồn tại trong database`);
            let data = (await getData(threadID)).prefix;
            await setData(threadID, { prefix: content });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET PREFIX THREAD ");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getLanguage(threadID, callback) {
        try {
            const dataUser = await getData(threadID) || {};
            if (!dataUser) throw new Error(`threadID: ${threadID} không tồn tại trong database`);
            const data = dataUser.language || global['client']['config']['LANGUAGE_SYS'];
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET PREFIX THREAD");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setLanguage(threadID, content, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) throw new Error(`Nhóm mang ID: ${threadID} không tồn tại trong database`);
            let data = (await getData(threadID)).language;
            await setData(threadID, { language: content });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET LANGUAGE USER ");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function increaseMember(threadID, number, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) return `Nhóm mang ID: ${threadID} không tồn tại trong database`;
            if (typeof number != 'number') throw new Error("Số không hợp lệ");
            let data = (await getData(threadID)).numberMember;
            await setData(threadID, { numberMember: number });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET MEMBER USER ++");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function decreaseMember(threadID, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) return `Nhóm mang ID: ${threadID} không tồn tại trong database`;
            let data = (await getData(threadID)).numberMember;
            await setData(threadID, { numberMember: data - 1 });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET MEMBER USER --");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function increaseMessageCount(threadID, callback) {
        try {
            if (!threadID) throw new Error("threadID không được để trống");
            if (isNaN(threadID)) throw new Error("threadID không hợp lệ");
            if (!Threads[threadID]) throw new Error(`Nhóm mang ID: ${threadID} không tồn tại trong database`);
            let data = (await getData(threadID)).messageCount;
            await setData(threadID, { messageCount: data + 1 });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET MESSAGE COUNT THREAD");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }


    return {
        createData,
        refreshInfo,
        getAll,
        getKey,
        getInfo,
        getData,
        setData,
        delData,
        getBanned,
        setBanned,
        unBanned,
        getName,
        setName,
        getPrefix,
        setPrefix,
        getLanguage,
        setLanguage,
        getStatus,
        setStatus,
        getUser,
        setUser,
        increaseMember,
        decreaseMember,
        increaseMessageCount
    };
};