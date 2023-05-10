"use strict";
import gradient from 'gradient-string';

const { rainbow, cristal, teen, mind, morning, vice, passion, fruit, instagram, retro, summer, pastel } = gradient;

export function load(data, type) {
    if (!type) var type_log = 'loading';
    else var type_log = type;
    console.log('\x1b[1;32m[ ' + type_log.toUpperCase() + ' ]\x1b[1;37m 〉\x1b[0m', '\x1b[1;37m' + data);
};

export function log(data, type) {
    var color = ["\x1b[1;33m", "\x1b[1;34m", "\x1b[1;35m", '\x1b[1;36m', '\x1b[1;32m'];
    var more = color[Math.floor(Math.random() * color.length)];
    console.log('\x1b[1;37m' + more + '[ ' + type.toUpperCase() + ' ]\x1b[1;37m 〉\x1b[0m', '\x1b[1;37m' + data);
};

export function error(data, type) {
    if (!type) var type_log = 'error';
    else var type_log = type;
    console.log('\x1b[1;31m[ ' + type_log.toUpperCase() + ' ]\x1b[1;37m 〉\x1b[0m', '\x1b[1;37m' + data);
}

export function warn(data, type) {
    if (!type) var type_log = 'warning';
    else var type_log = type;
    console.log('\x1b[1;93m[ ' + type_log.toUpperCase() + ' ]\x1b[1;37m 〉\x1b[0m', '\x1b[1;37m' + data);
}

export function rgb(data, type) {
    var color = ["\x1b[1;33m", "\x1b[1;34m", "\x1b[1;35m", '\x1b[1;36m', '\x1b[1;32m'];
    var color1 = [rainbow, cristal, teen, mind, morning, vice, passion, fruit, instagram, retro, summer, pastel];

    var more = color[Math.floor(Math.random() * color.length)];
    var more1 = color1[Math.floor(Math.random() * color1.length)];
    console.log('\x1b[1;37m' + more + '[ ' + type.toUpperCase() + ' ]\x1b[1;37m 〉\x1b[0m', more1(data));
};

export function printCenteredText(text) {
    const width = process.stdout.columns;
    const textLength = text.length;
    const leftPadding = Math.floor((width - textLength) / 2);
    if (leftPadding < 0) return console.log(text);
    const rightPadding = width - (textLength + leftPadding);
    const paddedText = ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);

    var color1 = [rainbow, cristal, teen, mind, morning, vice, passion, fruit, instagram, retro, summer, pastel];
    var more1 = color1[Math.floor(Math.random() * color1.length)];
    console.log(more1(paddedText));
}

export function printLeftAlignedText(text) {
    const width = process.stdout.columns;
    const paddedText = text.padEnd(width);
    
    var color1 = [rainbow, cristal, teen, mind, morning, vice, passion, fruit, instagram, retro, summer, pastel];
    var more1 = color1[Math.floor(Math.random() * color1.length)];
    console.log(more1(paddedText));
}