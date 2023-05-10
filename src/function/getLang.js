import * as fs from 'fs'
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const config = require('../../config/configMain.json')

global.language = new Object();
let getTxSys = config['LANGUAGE_SYS'];

const lang_FILE = (fs.readFileSync(process.cwd() + '/languages/' + getTxSys + '.loli' || process.cwd() + '/languages/' + 'vi_VN.loli', { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = lang_FILE.filter(item => item.indexOf('#') != 0 && item != '');
// load config language
var q, w;
q = langData[0];
w = q.replace(': {', '');
if (w.toLowerCase() != 'config' || !w) {
    console.error("can't load config of language: " + getTxSys || 'vi_VN.loli', 'language scripts');
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

export default function getText(...data) {
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