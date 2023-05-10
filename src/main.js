"use strict";

import axios from 'axios'
import fetch from "node-fetch"
import login from 'api-social'
import * as fs from 'fs'
import * as logger from "./function/logger.js"
import * as utils from './function/utils.js'
import * as translate from './function/translate.js'
import * as social from './function/social.js'
import * as handlerEvent from './database/handlerEvent.js'

import { createRequire } from "module"
const require = createRequire(import.meta.url)
const timeStart = Date.now();
const Config = require("../config/configMain.json")

//_____________________________CHECK FILE JSON_____________________________//
if (!fs.existsSync(process.cwd() + '/config/' + 'brotherList.json')) {
    fs.writeFileSync(process.cwd() + '/config/' + 'brotherList.json', JSON.stringify({}, null, 2));
}
if (!fs.existsSync(process.cwd() + '/config/' + 'envConfig.json')) {
    fs.writeFileSync(process.cwd() + '/config/' + 'envConfig.json', JSON.stringify({}, null, 2));
}
const _brotherList = require(process.cwd() + '/config/' + 'brotherList.json');
const _envConfig = require(process.cwd() + '/config/' + 'envConfig.json');
const { envGlobal, envCommands, envEvents } = _envConfig;

//_____________________________INITIAL GLOBAL_____________________________//
global.client = new Object({
    cmds: new Array(),
    events: new Array(),
    reply: new Array(),
    reaction: new Array(),
    timestamp: new Map(),
    cache: new Array(),
    config: Config,
    logger: logger,
    brotherList: _brotherList,
    envConfig: _envConfig,
    require: require,
    dirMain: process.cwd()
});

global.data = new Object({
    allThreadID: new Array(),
    allUserID: new Array(),
    threadBanned: new Array(),
    userBanned: new Array(),
    allThreadData: new Map(),
    allUserData: new Map()
});

global.sky = new Object({
    axios: axios,
    fetch: fetch,
    require: require,
    dl: utils.dl
});

global.utils = utils;

global.translate = translate;

global.social = social;

global.nodemodule = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();

//_____________________________GLOBAL GET TEXT_____________________________//
const lang_FILE = (fs.readFileSync(client.dirMain + '/languages/' + Config['LANGUAGE_SYS'] + '.loli' || client.dirMain + '/languages/' + 'vi_VN.loli', { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = lang_FILE.filter(item => item.indexOf('#') != 0 && item != '');
// load config lang
var q, w;
q = langData[0];
w = q.replace(': {', '');
if (w.toLowerCase() != 'config' || !w) {
    logger.error("can't load config of language: " + Config['LANGUAGE_SYS'] || 'vi_VN.loli', 'language scripts');
    process.exit(1);
} else {
    let c, e, r, t, p;
    c = langData.indexOf('}');
    for (var d = 1; d < c; d++) {
        e = langData[d];
        p = e.indexOf('=');
        r = e.slice(0, p) || r.split('[')[1].split(']')[0];
        t = e.slice(p + 2, e.length).split('"')[1];
        if (!global.language.config) global.language.config = {};
        global.language.config[r] = t;
    }
    var o, k, f, m;
    k = [];
    o = false;
    for (var i of langData) {
        if ((i.toLowerCase()).indexOf('index') == 0) {
            o = true;
        }
        if (o != false) {
            k.push(i);
        }
    }
    f = k.findIndex(y => y.toLowerCase().indexOf('index') == 0);
    k.splice(f, 1);
    f = k.findIndex(y => y.indexOf('}') == 0);
    k.splice(f, 1);
    m = k.filter(item => item.indexOf('  #') != 0 && item != '' && item != '  \n');
    for (var i of m) {
        var g, h, j, l, z;
        g = i.indexOf('=');
        h = i.slice(0, g);
        h = h.split('[')[1].split(']')[0];
        j = i.slice(g + 2, i.length).split('"')[1];
        z = j.replace(/\\n/gi, '\n');
        if (!global.language.index) global.language.index = {};
        global.language.index[h] = z;
    }
}

global.getText = function getText(...data) {
    var text = global.language.index;
    if (!text.hasOwnProperty(data[0])) return `- Not found key language: ${data[0]}`;
    var v, m;
    v = text[data[0]];
    for (var mm = data.length - 1; mm > 0; mm--) {
        m = RegExp('<' + mm + '>', 'g');
        v = v.replace(m, data[mm]);
    }
    return v;
}

// _____________________________LOGIN FACEBOOK_____________________________//
const pathFb = client.dirMain + '/' + Config['DATA_APPSTATE'] + '.json';
if (!fs.existsSync(pathFb)) {
    logger.warn(global.getText('FBSTATE_NO', Config['DATA_APPSTATE']));
    fs.writeFileSync(pathFb, JSON.stringify([], null, 2));
}

const dirFbstate = client.dirMain + '/fbstate.json';
const rqFbstate = require(dirFbstate);
const appState = JSON.parse(JSON.stringify(rqFbstate, 'null', '\t'));

if (typeof appState === 'object') {
    var fb_state = appState;
} else if (typeof appState === 'string') {
    var fb_state = global.utils.convertAtpToAppstate(appState);
} else {
    logger.error(global.getText('FBSTATE_ERR', Config['DATA_APPSTATE']), 'fbstate');
    process.exit();
}
logger.load(global.getText('FBSTATE_YES', Config['DATA_APPSTATE']), 'fbstate');
// console.clear();
login({ appState: fb_state }, { pauseLog: true }, async (err, api) => {
    if (err) {
        logger.error(err.error || err, 'LOGIN_APPSTATE');
        process.exit();
    } else if (api) {
        global.client.api = api;
        logger.load(global.getText('LOGIN_YES'), 'login');
        api.setOptions(Config['FCA']);
        const _handlerEvent = await handlerEvent.onListen({ api, Config, logger, timeStart, envGlobal, envCommands, envEvents });
        const onListen = (c) => api.listenMqtt(c);
        onListen(_handlerEvent);

        if (Config['AUTORESTART']['status'] == true) {
            setInterval(() => {
                fs.writeFileSync(dirFbstate, JSON.stringify(api.getAppState(), null, 2));
                process.exit(1);
            }, Config['AUTORESTART']['time']);
        }
        if (Config['RESTARTMQTT']['status'] == true) {
            setInterval(() => {
                logger.log('AutoRestart Mqtt...', 'restart');
                api.listenMqtt().stopListening();
                setTimeout(() => {
                    console.log('-> \x1b[1;37mRestart Mqtt Success');
                    return onListen(_handlerEvent);
                }, 2000);
            }, Config['RESTARTMQTT']['time']);
        }
    }
});
