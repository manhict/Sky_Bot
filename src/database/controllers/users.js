"use strict";
//Code by manhG. Facebook: Fb.com/manhict. Copyright by Sky. All rights reserved.
import usersModels from '../models/usersModel.js';
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createRequire } from "module"
const require = createRequire(import.meta.url)

export default async function ({ api, logger }) {
    const pathDataUser = join(client.dirMain, '/src/database/dataJson/', 'users.json');
    let moment = global.utils.getTimeZone();
    const { config } = global.client;
    const databaseType = config.DATABASE.type;
    let Users = {};
    if (databaseType == 'mongodb') {
        Users = (await usersModels.find({ type: 'user' }))[0].data || {};
        global.allUserData = Users;
    }
    else {
        if (!existsSync(pathDataUser)) {
            writeFileSync(pathDataUser, JSON.stringify(Users, null, 2));
        }
        Users = require(pathDataUser);
        global.allUserData = Users;
    }
    global.allUserData = Users;

    async function saveData(id) {
        if (databaseType == 'mongodb') {
            await usersModels.updateOne({ type: "user" }, {
                data: Users
            })
                .catch(err => logger.error("Đã xảy ra lỗi khi cập nhật dữ liệu của người dùng mang id " + id + "\n" + err, "MONGODB"));
            global.allUserData = Users;
        } else {
            global.allUserData = Users;
            writeFileSync(pathDataUser, JSON.stringify(Users, null, 2));
        }
    }

    function checkData(infoUser, senderID) {
        if (infoUser.gender == 2 || infoUser.gender == 'Nam') var gender = 'MALE';
        else var gender = 'FEMALE';
        if (infoUser.type == 'UnavailableMessagingActor') var status = false;
        else var status = true;
        const data = {
            id: senderID,
            name: infoUser.name,
            firstName: infoUser.firstName,
            vanity: infoUser.vanity || '',
            gender: gender,
            type: infoUser.type,
            profileUrl: infoUser.profileUrl,
            money: 0,
            exp: 0,
            status: status,
            banned: {
                status: false,
                reason: null,
                time: null
            },
            data: {},
            avatar: `https://graph.facebook.com/${senderID}/picture?height=1500&width=1500&access_token=${config.accessToken}`,
        };
        return data;
    }

    async function createData(senderID, callback) {
        try {
            if (isNaN(senderID) && senderID < 4 || !senderID) throw new Error("senderID không hợp lệ");
            if (Users[senderID]) return;
            if (global.data.allUserID.includes(senderID)) return;
            const infoUser = await api.getUserInfo(senderID);
            const data = await checkData(infoUser, senderID);
            Users[senderID] = data;
            await saveData(senderID);
            global.data.allUserID.push[senderID];
            if (callback && typeof callback == "function") callback(null, data);
            return data || infoUser;
        } catch (err) {
            const infoUser = await api.getUser(senderID);
            const data = await checkData(infoUser, senderID);
            global.data.allUserID.push[senderID];
            if (callback && typeof callback == "function") callback(null, data);
            return data || infoUser;

            // if (callback && typeof callback == "function") callback(err, null);
            // logger.error(err.errorSummary +' ID: '+ senderID || err, "CREATE DATA USER");
            // return err.message;
        }
    }

    async function refreshInfo(senderID, callback) {
        try {
            if (!Users[senderID]) return false;
            if (isNaN(senderID)) throw new Error("senderID không hợp lệ");
            const InfoUser = await getData(senderID) || {};
            const updateInfoUser = (await api.getUserInfo(senderID));
            if (updateInfoUser.gender == 2) var gender = 'MALE';
            else var gender = 'FEMALE';
            if (updateInfoUser.type == 'UnavailableMessagingActor') var status = false;
            else var status = true;
            InfoUser.name = updateInfoUser.name;
            InfoUser.firstName = updateInfoUser.firstName;
            InfoUser.vanity = updateInfoUser.vanity;
            InfoUser.gender = gender;
            InfoUser.type = updateInfoUser.type;
            InfoUser.profileUrl = updateInfoUser.profileUrl;
            InfoUser.money;
            InfoUser.exp;
            InfoUser.status = status;
            InfoUser.banned;
            InfoUser.data;
            InfoUser.avatar = `https://graph.facebook.com/${senderID}/picture?height=1500&width=1500&access_token=${config.accessToken}`;

            Users[senderID] = InfoUser;

            await saveData(senderID);
            if (callback && typeof callback == "function") callback(null, InfoUser);
            return InfoUser;
        } catch (err) {
            if (callback && typeof callback == "function") callback(err, null);
            logger.error(err.stack + ' ID: ' + senderID || err, "CREATEDATA USER");
            return err.message;
        }
    }

    async function getInfo(senderID, callback) {
        try {
            if (senderID == undefined || senderID < 4 || isNaN(senderID)) throw new Error(`senderID: ${senderID} không hợp lệ`);
            const data = await api.getUserInfo(senderID);
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET INFO USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getAll(callback) {
        try {
            const data = Users;
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET ALL USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getKey(keys, callback) {
        try {
            if (!keys) return Users;
            if (!Array.isArray(keys)) return "Tham số truyền vào phải là 1 array";
            const data = [];
            for (let senderID in Users) {
                const db = { id: senderID };
                const dataU = Users[senderID];
                for (let key of keys) db[key] = dataU[key];
                data.push(db);
            };
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            if (callback && typeof callback == "function") callback(err, null);
            logger.error(err, "GET KEY USER");
            return err.message;
        }
    }

    async function getData(senderID, callback) {
        try {
            if (senderID == undefined || senderID < 4 || isNaN(senderID)) throw new Error(`senderID: ${senderID} không hợp lệ`);
            if (!Users[senderID]) await createData(senderID);
            const data = Users[senderID];
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err, "GET DATA USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setData(senderID, options, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            if (isNaN(senderID)) throw new Error("senderID không hợp lệ");
            if (typeof options != 'object') throw new Error("Options truyền vào phải là 1 object");
            var keys = Object.keys(options);
            if (!Users[senderID]) return `Người dùng mang ID: ${senderID} không tồn tại trong database `;
            for (let key of keys) Users[senderID][key] = options[key];
            await saveData(senderID);
            if (callback && typeof callback == "function") callback(null, Users[senderID]);
            return Users[senderID];
        } catch (err) {
            logger.error(err.stack || err, "SET DATA USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getName(senderID, callback) {
        try {
            if (senderID == undefined || senderID < 4 || isNaN(senderID)) throw new Error(`senderID: ${senderID} không hợp lệ`);
            if (!Users[senderID]) await createData(senderID);
            const data = await getData(senderID) || {};
            const nameUser = data.name || senderID;
            if (callback && typeof callback == "function") callback(null, data);
            return nameUser || senderID;
        } catch (err) {
            logger.error(err.stack || err, "GET NAME USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setName(senderID, content, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            const dataUser = await getData(senderID) || {};
            const data = dataUser.name || senderID;
            await setData(senderID, { status: content });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET NAME USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getStatus(senderID, callback) {
        try {
            if (senderID == undefined || senderID < 4 || isNaN(senderID)) throw new Error(`senderID: ${senderID} không hợp lệ`);
            const dataUser = await getData(senderID) || {};
            //if (!dataUser) throw new Error("senderID không tồn tại trong database");
            const data = dataUser.status;
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "GET STATUS USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function setStatus(senderID, content, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            if (isNaN(senderID)) throw new Error(`senderID: ${senderID}không hợp lệ `);
            const dataUser = await getData(senderID) || {};
            const data = dataUser.status;
            await setData(senderID, { status: content });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (err) {
            logger.error(err.stack || err, "SET STATUS USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function increaseMoney(senderID, money, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            if (isNaN(senderID)) throw new Error("senderID không hợp lệ");
            if (!Users[senderID]) throw new Error(`Người dùng mang ID: ${senderID} không tồn tại trong database`);
            if (typeof money != 'number') throw new Error("Số tiền không hợp lệ");
            let balance = (await getData(senderID)).money;
            await setData(senderID, { money: balance + money });
            if (callback && typeof callback == "function") callback(null, balance);
            return balance;
        } catch (err) {
            logger.error(err.stack || err, "SET COINS USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function decreaseMoney(senderID, money, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            if (isNaN(senderID)) throw new Error("senderID không hợp lệ");
            if (!Users[senderID]) throw new Error(`Người dùng mang ID: ${senderID} không tồn tại trong database`);
            if (typeof money != 'number') throw new Error("Số tiền không hợp lệ");
            let balance = (await getData(senderID)).money;
            await setData(senderID, { money: balance - money });
            if (callback && typeof callback == "function") callback(null, balance);
            return balance;
        } catch (err) {
            logger.error(err.stack || err, "SET COINS USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function increaseExp(senderID, exp, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            if (isNaN(senderID)) throw new Error("senderID không hợp lệ");
            if (!Users[senderID]) throw new Error(`Người dùng mang ID: ${senderID} không tồn tại trong database`);
            if (typeof exp != 'number') throw new Error("Số exp không hợp lệ");
            let exp1 = (await getData(senderID)).exp;
            await setData(senderID, { exp: exp1 + exp });
            if (callback && typeof callback == "function") callback(null, exp1);
            return exp1;
        } catch (err) {
            logger.error(err.stack || err, "SET EXP USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function decreaseExp(senderID, exp, callback) {
        try {
            if (!senderID) throw new Error("senderID không được để trống");
            if (isNaN(senderID)) throw new Error("senderID không hợp lệ");
            if (!Users[senderID]) throw new Error(`Người dùng mang ID: ${senderID} không tồn tại trong database`);
            if (typeof exp != 'number') throw new Error("Số exp không hợp lệ");
            let exp1 = (await getData(senderID)).exp;
            await setData(senderID, { exp: exp1 - exp });
            if (callback && typeof callback == "function") callback(null, exp1);
            return exp1;
        } catch (err) {
            logger.error(err.stack || err, "SET EXP USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    async function getBanned(senderID, callback) {
        try {
            if (senderID) {
                if (isNaN(senderID)) throw new Error('senderID không hợp lệ');
                const dataUser = await getData(senderID) || {};
                const dataBanned = dataUser.banned || {};
                if (dataBanned.status == true) {
                    const data = { id: dataUser.id, Name: dataUser.name, Reason: dataBanned.reason, Time: dataBanned.time };
                    if (callback && typeof callback == 'function') callback(null, data);
                    return data;
                } else {
                    return `Người dùng mang id: ${senderID} không bị ban từ trước`;
                }
            } else {
                var userData = await getKey(["id", "name", "banned"]);
                var listBanned = [],
                    listBan = [],
                    userArray = [],
                    i = 0;
                for (let userInfo of userData) {
                    if (userInfo.banned != undefined) {
                        if (userInfo.banned.status == true) {
                            listBanned.push({
                                idUser: userInfo.id,
                                nameUser: userInfo.name || "Noname",
                                reason: userInfo.banned.reason,
                                time: userInfo.banned.time
                            });
                        }
                    }
                }
                var listBan = listBanned.sort((a, b) => {
                    if (a.time > b.time) return -1;
                    if (a.time < b.time) return 1;
                });
                for (var user of listBan) {
                    userArray.push({ id: user.idUser, name: user.nameUser, reason: user.reason, time: user.time });
                }
                if (callback && typeof callback == 'function') callback(null, msg);
                return userArray;
            }
        } catch (err) {
            logger.error(err.stack || err, 'GET BANNED USER DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function setBanned(senderID, reason, callback) {
        try {
            if (!senderID) throw new Error('senderID không được để trống');
            if (isNaN(senderID)) throw new Error('senderID không hợp lệ');
            if (!reason) return ('Lý do cấm người dùng không được để trống');
            const dataBanned = (await getData(senderID)).banned || {};
            if (dataBanned.status == true) return (`Người dùng mang id ${senderID} đã bị ban từ trước `);
            dataBanned.status = true,
                dataBanned.reason = reason || null,
                dataBanned.time = moment
            await setData(senderID, { banned: dataBanned });
            if (callback && typeof callback == 'function') callback(null, dataBanned);
            return dataBanned;
        } catch (err) {
            logger.error(err.stack || err, 'SET BANNED USER DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function unBanned(senderID, callback) {
        try {
            if (!senderID) throw new Error('senderID không được để trống');
            if (isNaN(senderID)) throw new Error('senderID không hợp lệ');
            const dataBanned = (await getData(senderID)).banned || {};
            if (dataBanned.status == false) return (`Người dùng mang id ${senderID} không bị ban từ trước `);
            dataBanned.status = false,
                dataBanned.reason = null,
                dataBanned.time = null;
            setData(senderID, { banned: dataBanned });
            if (callback && typeof callback == 'function') callback(null, dataBanned);
            return dataBanned;
        } catch (err) {
            logger.error(err.stack || err, 'UN BANNED USER DATA');
            if (callback && typeof callback == 'function') callback(err, null);
            return err.message;
        }
    }

    async function delData(senderID, callback) {
        try {
            delete Users[senderID];
            const data = await saveData(senderID);
            if (callback && typeof callback == "function") callback(null, data);
        } catch (err) {
            logger.error(err.stack || err, "DELDATA USER");
            if (callback && typeof callback == "function") callback(err, null);
            return err.message;
        }
    }

    return {
        createData,
        refreshInfo,
        getInfo,
        getAll,
        getKey,
        getData,
        setData,
        delData,
        getName,
        setName,
        getStatus,
        setStatus,
        getBanned,
        setBanned,
        unBanned,
        increaseMoney,
        decreaseMoney,
        increaseExp,
        decreaseExp
    }
}
