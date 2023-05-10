export const config = {
  name: "coveralime",
  version: "1.0.0",
  role: 0,
  author: "Hanaku UwuU",
  viDesc: "Baner Cover Anime",
  enDesc: "Cover Anime",
  category: ['Edit Card', 'Edit Card'],
  usages: "Cover Anime",
  timestamp: 5
};

import axios from "axios";
import fs from "fs";
import path from "path";
import Canvas, { loadImage, createCanvas } from "canvas";

export function wrapText(ctx, text, maxWidth) {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}
export async function onMessage({ api, args, event }) {
  if (args[0] == "find" || args[0] == "tìm") {
    const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data
    const t = (await axios.get(`${lengthchar[args[1]].imgAnime}`, {
      responseType: "stream"
    })).data;
    const msg = ({
      body: `char mang số thứ tự ${args[1]}`,
      attachment: t
    })
    return api.sendMessage(msg, event.threadID, event.messageID)
  }
  if (!args[0]) {
    const abcxyz = ["https://imgur.com/wxoGkst.png", "https://imgur.com/6we7T1g.png", "https://imgur.com/W1TNnj9.png", "https://imgur.com/qZAh20x.png", "https://imgur.com/aHK6mRg.png", "https://imgur.com/kEbCjD9.png"]
    let o = [];
    for (let i = 0; i < abcxyz.length; i++) {
      const t = (await axios.get(`${abcxyz[i]}`, {
        responseType: "stream"
      })).data;
      o.push(t)
    }
    const msg = ({
      body: "- Reply Tin Nhắn Theo Số Thứ Tự Để Chọn Kiểu",
      attachment: o
    })
    return api.sendMessage(msg, event.threadID, (err, info) => {
      return client.reply.push({
        step: 1,
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    }, event.messageID);
  }
}
export async function onReply({ api, event, args, reply, Threads, Users }) {
  if (reply.author != event.senderID) return api.sendMessage('CúC', event.threaID);
  let pathImg1 = process.cwd() + `/caches/avatar_1_11.png`;
  let pathImg2 = process.cwd() + `/caches/avatar_1_21.png`;
  let pathImg = process.cwd() + `/caches/avatar_1.png`;
  let pathAva = process.cwd() + `/caches/avatar_2.png`;
  let pathLine = process.cwd() + `/caches/avatar_3.png`;
  let pathLine2 = process.cwd() + `/caches/avatar_34.png`;
  let pathLine3 = process.cwd() + `/caches/avatar_33.png`;
  let pathLine4 = process.cwd() + `/caches/avatar_31.png`;
  let pathLine5 = process.cwd() + `/caches/avatar_32.png`;
  let pathLine6 = process.cwd() + `/caches/avatar_33.png`;
  let pathLine7 = process.cwd() + `/caches/avatar_3s3.png`;
  let pathIcon = process.cwd() + `/caches/avatar_3ds23c12311.png`;
  let pathIconIG = process.cwd() + `/caches/sssss.png`;
  let pathIcongithub = process.cwd() + `/caches/owo.png`;
  let line = process.cwd() + `/caches/12341o.png`;
  const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data
  if (!fs.existsSync(process.cwd() + `/caches/GMV_DIN_Pro.ttf`)) {
    let getfont = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/GMV_DIN_Pro.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/GMV_DIN_Pro.ttf`, Buffer.from(getfont, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/Asem-Kandis-PERSONAL-USE.ttf`)) {
    let getfont2 = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/Asem-Kandis-PERSONAL-USE.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/Asem-Kandis-PERSONAL-USE.ttf`, Buffer.from(getfont2, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/MTD William Letter.otf`)) {
    let getfont3 = (await axios.get(`https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/MTD William Letter.otf`, Buffer.from(getfont3, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/SteelfishRg-Regular.otf`)) {
    let getfont4 = (await axios.get(`https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/SteelfishRg-Regular.otf`, Buffer.from(getfont4, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/SVN-BigNoodleTitling.otf`)) {
    let getfont5 = (await axios.get(`https://drive.google.com/u/0/uc?id=1uCXXgyepedb9xwlqMsMsvH48D6wwCmUn&export=download`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/SVN-BigNoodleTitling.otf`, Buffer.from(getfont5, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/MTOJamai.ttf`)) {
    let getfon2t = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/MTOJamai.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/MTOJamai.ttf`, Buffer.from(getfon2t, "utf-8"));
  }
  if (!fs.existsSync(process.cwd() + `/caches/phenomicon.ttf`)) {
    let getfontzz = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/phenomicon.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/phenomicon.ttf`, Buffer.from(getfontzz, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/SVN-Big Noodle Titling.otf`)) {
    let getfon2ts = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/SVN-Big%20Noodle%20Titling.otf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/SVN-Big Noodle Titling.otf`, Buffer.from(getfon2ts, "utf-8"));
  };
  if (!fs.existsSync(process.cwd() + `/caches/EBGaramond-VariableFont_wght.ttf`)) {
    let getfon2tcc = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/EBGaramond-VariableFont_wght.ttf`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(process.cwd() + `/caches/EBGaramond-VariableFont_wght.ttf`, Buffer.from(getfon2tcc, "utf-8"));
  }
  const { threadID, messageID, senderID } = event;
  if (reply.step == 1) {
    if (isNaN(event.body)) return api.sendMessage('Không phải là một con số ?', event.threadID)
    api.unsendMessage(reply.messageID);
    return api.sendMessage(`Bạn đã chọn kiểu là ${event.body} reply tin nhắn này để nhập id nhân vật`, threadID, function (err, info) {
      return client.reply.push({
        step: 2,
        name: this.config.name,
        author: senderID,
        kieu: event.body,
        messageID: info.messageID
      })
    }, messageID);
  }
  else if (reply.step == 2) {
    api.unsendMessage(reply.messageID);
    return api.sendMessage(`Bạn đã chọn nhân vật là ${event.body} reply tin nhắn này để nhập tên chính`, threadID, function (err, info) {
      return client.reply.push({
        step: 3,
        name: this.config.name,
        author: senderID,
        kieu: reply.kieu,
        idnv: event.body,
        messageID: info.messageID
      })
    }, messageID);
  }
  else if (reply.step == 3) {
    api.unsendMessage(reply.messageID);
    if (reply.kieu == 5 && reply.step == 3) {
      return api.sendMessage(`Bạn đã chọn tên chính là ${event.body}, reply tin nhắn này để chọn màu ( hãy ghi no nếu bạn muốn dùng màu mặc định )`, threadID, function (err, info) {
        return client.reply.push({
          step: 5,
          name: this.config.name,
          author: senderID,
          kieu: reply.kieu,
          idnv: reply.idnv,
          tenchinh: event.body,
          messageID: info.messageID
        })
      }, messageID);
    } else {
      return api.sendMessage(`Bạn đã chọn tên chính là ${event.body} reply tin nhắn này để nhập tên phụ`, threadID, function (err, info) {
        return client.reply.push({
          step: 4,
          name: this.config.name,
          author: senderID,
          kieu: reply.kieu,
          idnv: reply.idnv,
          tenchinh: event.body,
          messageID: info.messageID
        })
      }, messageID);
    }
  }
  else if (reply.step == 4) {
    api.unsendMessage(reply.messageID);
    if (reply.kieu == 6) {
      return api.sendMessage(`Bạn đã chọn tên phụ là ${event.body}, reply tin nhắn này ghi những gì bạn thích`, threadID, function (err, info) {
        return client.reply.push({
          step: 4.1,
          name: this.config.name,
          author: senderID,
          kieu: reply.kieu,
          idnv: reply.idnv,
          tenchinh: reply.tenchinh,
          tenphu: event.body,
          messageID: info.messageID
        })
      }, messageID);
    } else {
      return api.sendMessage(`Bạn đã chọn tên phụ là ${event.body}, reply tin nhắn này để chọn màu ( hãy ghi no nếu bạn muốn dùng màu mặc định )`, threadID, function (err, info) {
        return client.reply.push({
          step: 5,
          name: this.config.name,
          author: senderID,
          kieu: reply.kieu,
          idnv: reply.idnv,
          tenchinh: reply.tenchinh,
          tenphu: event.body,
          messageID: info.messageID
        })
      }, messageID);
    }
  }
  else if (reply.step == 4.1) {
    api.unsendMessage(reply.messageID);
    return api.sendMessage(`Bạn đã chọn cái vớ vẩn gì đó là ${event.body}, reply để nhập link hoặc cc gì đó`, threadID, function (err, info) {
      return client.reply.push({
        step: 4.2,
        name: this.config.name,
        author: senderID,
        kieu: reply.kieu,
        idnv: reply.idnv,
        tenchinh: reply.tenchinh,
        tenphu: reply.tenphu,
        fact: event.body,
        messageID: info.messageID
      })
    }, messageID);
  }
  else if (reply.step == 4.2) {
    api.unsendMessage(reply.messageID);
    return api.sendMessage(`Bạn đã chọn cái vớ vẩn gì đó thứ 2 là ${event.body}, reply để nhập màu`, threadID, function (err, info) {
      return client.reply.push({
        step: 5,
        name: this.config.name,
        author: senderID,
        kieu: reply.kieu,
        idnv: reply.idnv,
        tenchinh: reply.tenchinh,
        tenphu: reply.tenphu,
        fact: reply.fact,
        abcxyzlm: event.body,
        messageID: info.messageID
      })
    }, messageID);
  }
  else if (reply.step == 5) {
    const type = reply.kieu;
    const char = reply.idnv;
    const tenchinh = reply.tenchinh;
    const subname = reply.tenphu;
    const color = event.body;
    //const test = "https://facebook.com/" + `${senderID}`
    if (color == "no" || color == "No") {
      var color_ = lengthchar[char].colorBg;
    } else {
      var color_ = color;
    }
    if (type == 1) {
      let avtAnime = (
        await axios.get(encodeURI(`${lengthchar[char].imgAnime}`), { responseType: "arraybuffer" })).data;
      let line = (await axios.get(encodeURI(
        `https://i.imgur.com/4BQHmeI.png`),
        { responseType: "arraybuffer" })).data;
      let background = (await axios.get(encodeURI(`https://i.imgur.com/HUblFwC.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
      fs.writeFileSync(pathLine, Buffer.from(line, "utf-8"));
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

      Canvas.registerFont(process.cwd() + `/caches/GMV_DIN_Pro.ttf`, {
        family: "GMV DIN Pro Cond"
      });
      Canvas.registerFont(process.cwd() + `/caches/` + `Asem-Kandis-PERSONAL-USE.ttf`, {
        family: "Asem Kandis"
      });
      
      let a = await loadImage(pathImg);
      let ab = await loadImage(pathAva);
      let az = await loadImage(pathLine);
      let canvas1 = createCanvas(1500, 1500);
      var ctx1 = canvas1.getContext("2d");
      let canvas = createCanvas(a.width, a.height);
      var ctx = canvas.getContext("2d");

      ctx1.fillStyle = "#ffff"
      ctx1.fillRect(0, 0, 1500, 1500)
      ctx1.save();
      ctx1.globalAlpha = "0.3";
      ctx1.drawImage(ab, 0, 0, 1500, 1500);
      ctx1.restore();
      ctx1.save();
      ctx1.fillStyle = "#000"
      ctx1.globalCompositeOperation = "color";
      ctx1.fillRect(0, 0, 1500, 1500)
      ctx1.restore();
      ctx.clearRect(0, 0, canvas.width, canvas.width);
      ctx.fillStyle = color_;
      ctx.fillRect(0, 0, canvas.width, canvas.width);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(a, 0, 0, canvas.width, canvas.width);
      ctx.globalCompositeOperation = "destination-over";
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.width);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255,0.8)";
      ctx.restore();
      ctx.save();
      ctx.fillStyle = '#FFF';
      ctx.fillRect(0, 700, 1500, 337);
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color_
      ctx.filter = 'grayscale(1)';
      ctx.globalAlpha = "0.7";
      //ctx.fillStyle = 'grayscale(1)';
      ctx.fillRect(0, 730, 1500, 275);
      ctx.drawImage(az, 0, 0, canvas.width, canvas.width);
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(canvas1, -canvas.width / 4, -canvas.width / 4, canvas.width * 1.5, canvas.width * 1.5);
      ctx.restore();
      ctx.textAlign = "center";
      
      ctx.fillStyle = "rgba(255, 255, 255,0.8)";
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.font = "250px GMV DIN Pro Cond";
      ctx.strokeText(tenchinh, canvas.width / 2, 664);
      ctx.fillText(tenchinh, canvas.width / 2, 945);
      ctx.restore();
      ctx.save();
      ctx.save();
      ctx.drawImage(ab, 0, 0, canvas.width, canvas.width);
      ctx.restore();
      ctx.save();
      
      ctx.textAlign = "center";
      ctx.fillStyle = color_;
      ctx.font = "120px Asem Kandis"
      ctx.fillText(subname, canvas.width / 2, 200)
      ctx.save();
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: "Ảnh Của Bạn Đây",
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        fs.unlinkSync(pathAva),
        fs.unlinkSync(pathLine),
        event.messageID
      );
    } else if (type == 2) {
      let avtAnime = (
        await axios.get(encodeURI(`${lengthchar[char].imgAnime}`), { responseType: "arraybuffer" })).data;
      let line = (await axios.get(encodeURI(
        `https://1.bp.blogspot.com/-5SECGn_32Co/YQkQ-ZyDSPI/AAAAAAAAv1o/nZYKV0s_UPY41XlfWfNIX0HbVoRLhnlogCNcBGAsYHQ/s0/line.png`), { responseType: "arraybuffer" })).data;
      let background = (await axios.get(encodeURI(`https://i.imgur.com/j8FVO1W.jpg`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
      fs.writeFileSync(pathLine, Buffer.from(line, "utf-8"));
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

      Canvas.registerFont(process.cwd() + `/caches/SteelfishRg-Regular.otf`, {
        family: "SteelfishRg-Regular"
      });
      Canvas.registerFont(process.cwd() + `/caches/MTD William Letter.otf`, {
        family: "MTD William Letter"
      });

      let amg = await loadImage(pathImg);
      let cmg = await loadImage(pathAva);
      let omg = await loadImage(pathLine);
      let canvas = createCanvas(amg.width, amg.height);
      let ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = color_
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `430px SteelfishRg-Regular`;
      ctx.textAlign = "center";
      ctx.fillStyle = "rgb(255 255 255 / 70%)"
      ctx.globalAlpha = 0.7
      ctx.fillText(tenchinh.toUpperCase(), canvas.width / 2, 1350)
      ctx.globalAlpha = 1
      ctx.strokeStyle = "white"
      ctx.lineWidth = 7
      ctx.textAlign = "center"
      ctx.strokeText(tenchinh.toUpperCase(), canvas.width / 2, 900)
      ctx.strokeText(tenchinh.toUpperCase(), canvas.width / 2, 1800)
      ctx.drawImage(cmg, 0, 0, 2000, 2000);
      ctx.drawImage(omg, 0, 0, canvas.width, canvas.height)

      ctx.font = `300px MTD William Letter`;
      ctx.fillStyle = `#FFFFFF`
      ctx.textAlign = "center";
      ctx.fillText(subname, canvas.width / 2, 350);
      ctx.beginPath();
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: "Ảnh Của Bạn Đây",
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        fs.unlinkSync(pathAva),
        fs.unlinkSync(pathLine),
        event.messageID
      );
    }
    else if (type == 3) {
      let avtAnime = (
        await axios.get(encodeURI(`${lengthchar[char].imgAnime}`), { responseType: "arraybuffer" })).data;
      let background = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-p0IHqcx8eWE/YXZN2izzTrI/AAAAAAAAym8/T-hqrJ2IFooUfHPeVTbiwu047RkmxGLzgCNcBGAsYHQ/s0/layer2.jpg`), {
          responseType: "arraybuffer",
        })
      ).data;
      let hieuung = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png`), {
          responseType: "arraybuffer",
        })
      ).data;

      Canvas.registerFont(process.cwd() + `/caches/SVN-BigNoodleTitling.otf`, {
        family: "SVN-BigNoodleTitling"
      });
      Canvas.registerFont(process.cwd() + `/caches/SVN-BigNoodleTitling.otf`, {
        family: "SVN-BigNoodleTitling"
      });

      fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
      fs.writeFileSync(pathLine, Buffer.from(hieuung, "utf-8"));
      let h = await loadImage(pathImg);
      let u = await loadImage(pathAva);
      let k = await loadImage(pathLine);
      let canvas = createCanvas(h.width, h.height);
      let ctx = canvas.getContext("2d");

      ctx.drawImage(h, 0, 0, h.width, h.height);
      ctx.fillStyle = color_;
      ctx.filter = "grayscale(1)"
      ctx.fillRect(0, 164, canvas.width, 633)
      ctx.drawImage(k, 0, 0, h.width, h.height);
      ctx.globalAlpha = 0.5
      ctx.drawImage(u, 0, -320, canvas.width, canvas.width)
      ctx.beginPath();
      ctx.globalAlpha = 1
      ctx.transform(1, 0, -0.2, 1, 0, 0)
      
      ctx.font = `italic 200px SVN-BigNoodleTitling`;
      ctx.fillStyle = `#FFFFFF`
      ctx.textAlign = "end";
      ctx.globalAlpha = 0.8
      ctx.fillText(tenchinh.toUpperCase(), 1215, 535);
      
      ctx.font = `60px SVN-BigNoodleTitling`;
      ctx.fillStyle = `#FFFFFF`
      ctx.textAlign = "end";
      ctx.globalAlpha = 1
      var l = ctx.measureText(subname).width;
      ctx.fillRect(1500, 164, 150, 633)
      ctx.fillRect(canvas.width - l - 540, 580, l + 50, 75)
      ctx.fillStyle = color_
      ctx.fillText(subname.toUpperCase(), 1195, 640);
      ctx.fillStyle = `#FFFFFF`
      ctx.globalAlpha = 0.5
      ctx.fillRect(1300, 164, 150, 633)
      ctx.globalAlpha = 1
      ctx.transform(1, 0, 0.2, 1, 0, 0)
      ctx.filter = "grayscale(0)"
      ctx.drawImage(u, 1010, 97, 700, 700)
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: `Ảnh của bạn đây`,
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        fs.unlinkSync(pathAva),
        fs.unlinkSync(pathLine),
        event.messageID
      );
    }
    else if (type == 4) {
      let background = (await axios.get(encodeURI(`https://lh3.googleusercontent.com/-JZxo4uTVIKQ/YaS7VBjAojI/AAAAAAAA1rk/mg_Bp0Z6_yUGLp1lfC9ugriYTGFfRaXTwCNcBGAsYHQ/s0/layer-2.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
      let background2 = (await axios.get(encodeURI(`https://lh3.googleusercontent.com/-j9JKCim94ks/YaIMA7fVnPI/AAAAAAAA1k8/g9e5X5FfRH4NiG-7hHRNikGxViI2o8pYQCNcBGAsYHQ/s0/layer-3.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg1, Buffer.from(background2, "utf-8"));
      let background3 = (await axios.get(encodeURI(`https://lh3.googleusercontent.com/-F8w1tQRZ9s0/YXZZmKaylRI/AAAAAAAAynI/HBoYISaw-LE2z8QOE39OGwTUiFjHUH6xgCNcBGAsYHQ/s0/layer4.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg2, Buffer.from(background3, "utf-8"));
      let ava = (await axios.get(encodeURI(`${lengthchar[char].imgAnime}`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(ava, "utf-8"));
      if (!fs.existsSync(process.cwd() + `/caches/UTM-Avo.ttf`)) {
        let getfont = (await axios.get(`https://github.com/hanakuUwU/font/blob/main/UTM%20Avo.ttf?raw=true`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(process.cwd() + `/caches/UTM-Avo.ttf`, Buffer.from(getfont, "utf-8"));
      }

      Canvas.registerFont(process.cwd() + `/caches/UTM-Avo.ttf`, {
        family: "UTM-Avo"
      });

      const test = "https://facebook.com/" + event.senderID;
      let l1 = await loadImage(pathAva);
      let l2 = await loadImage(pathImg);
      let l3 = await loadImage(pathImg1);
      let l4 = await loadImage(pathImg2);
      let a = await loadImage(pathImg);
      let canvas = createCanvas(a.width, a.height);
      var ctx = canvas.getContext("2d");
      
      ctx.save();
      ctx.fillStyle = color_;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
      ctx.drawImage(l2, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = "0.5"
      ctx.drawImage(l1, -300, -300, 1500, 1500);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.transform(1, 0, 1, 1, 0, 0);
      ctx.fillRect(500, 0, 650, 740);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.save();
      ctx.transform(1, 0, 1, 1, 0, 0);
      ctx.rect(500, 0, 650, 740);
      ctx.restore();
      ctx.clip();
      ctx.save();
      ctx.globalAlpha = "0.1";
      ctx.drawImage(l1, 300, -300, 1500, 1500);
      ctx.restore();
      ctx.save();
      ctx.drawImage(l3, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.restore();
      var ttx = 950;
      var tty = 600;
      var ttpad = 180;
      var ttsize = "300px";
      ctx.save();
      ctx.beginPath();
      ctx.save();
      ctx.transform(1, 0, 1, 1, 0, 0);
      ctx.rect(500, 0, 650, 740);
      ctx.restore();
      ctx.clip();
      ctx.save();
      ctx.translate(ttx, tty);
      ctx.globalAlpha = 0.5;
      ctx.rotate(Math.PI / 180 * 45);
      ctx.strokeStyle = color_;
      ctx.lineWidth = 4;
      ctx.textAlign = "center";
      ctx.font = ttsize + " DIN Condensed";
      ctx.strokeText(subname.split("").join(String.fromCharCode(8203)), 0, 0);
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = color_;
      ctx.lineWidth = 2;
      ctx.translate(ttx + ttpad, tty - ttpad);
      ctx.rotate(Math.PI / 180 * 45);
      ctx.textAlign = "center";
      ctx.font = ttsize + " DIN Condensed";
      ctx.fillText(subname.split("").join(String.fromCharCode(8202)), 0, 0);
      ctx.restore();
      ctx.strokeStyle = color_;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 5;
      ctx.translate(ttx + ttpad * 2, tty - ttpad * 2);
      ctx.rotate(Math.PI / 180 * 45);
      ctx.textAlign = "center";
      ctx.font = ttsize + " DIN Condensed"; ctx.strokeText(subname.split("").join(String.fromCharCode(8202)), 0, 0);
      ctx.restore();
      ctx.restore();
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0, 0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.drawImage(l1, 900, -200, 1000, 1000);
      ctx.restore();
      ctx.save();
      //ctx.style.letterSpacing = '5px';
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "bold 65px UTM-Avo";
      ctx.fillText(tenchinh, 430, 390);
      ctx.restore();
      ctx.save();
      // ctx.style.letterSpacing = '10px';
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "27px UTM-Avo";
      ctx.fillText(test.toUpperCase(), 430, 440);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.fillRect(430 - 300 / 2, 470, 300, 5)
      ctx.font = "27px UTM-Avo";
      ctx.fillText("+++".toUpperCase(), 150, 300);
      ctx.restore();
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: "Ảnh Của Bạn Đây",
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        fs.unlinkSync(pathImg1),
        fs.unlinkSync(pathImg2),
        fs.unlinkSync(pathAva),
        event.messageID
      );
    }
    else if (type == 5) {
      let avtAnime = (
        await axios.get(encodeURI(`${lengthchar[char].imgAnime}`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
      ///bg
      let bg1 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-tZ8DTN-bXEY/YhScBI5VuSI/AAAAAAAA5QI/8OxatfQvJU8q4TWk8vo9OWawDRn0aQhOACNcBGAsYHQ/s0/a1.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(bg1, "utf-8"));
      //line
      let line1 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-_GlhDWCWQLA/YhScA7so4UI/AAAAAAAA5QA/4NqayceKTTkbQrPT0Cu5TQCuEp-V95T3ACNcBGAsYHQ/s0/a2.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine, Buffer.from(line1, "utf-8"));
      //line
      let line2 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-IiDSkRdLuK4/YhScA1Xd7WI/AAAAAAAA5QE/KlFoQuZpFc8W31A2C8-uUmXkpvLbmL6JQCNcBGAsYHQ/s0/a3.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine2, Buffer.from(line2, "utf-8"));
      //line
      let line7 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-jagDZ8l1rwc/YhSbpTKubAI/AAAAAAAA5P4/GYy2WICTkHAM0AoJvYhsLc6asVsnbAR2wCNcBGAsYHQ/s0/l1.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine7, Buffer.from(line7, "utf-8"));
      //line
      let line3 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-jagDZ8l1rwc/YhSbpTKubAI/AAAAAAAA5P4/GYy2WICTkHAM0AoJvYhsLc6asVsnbAR2wCNcBGAsYHQ/s0/l1.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine3, Buffer.from(line3, "utf-8"));
      //line
      let line4 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-EE6U5xmi_QY/YhScRCT94XI/AAAAAAAA5QY/6WJM0j7URsgjisGTEN-tgOJ6NVx_Ql5-ACNcBGAsYHQ/s0/l2.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine4, Buffer.from(line4, "utf-8"));
      //line
      let line5 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-hkTkESFE1OU/YhSdWD3kR_I/AAAAAAAA5Qk/Fw4rwDc5CxEaLacLatZJLT6FAnm5dNYYACNcBGAsYHQ/s0/b1.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine5, Buffer.from(line5, "utf-8"));
      //line
      let line6 = (
        await axios.get(encodeURI(`https://lh3.googleusercontent.com/-U-P92f1nTfk/YhSdVnqbEFI/AAAAAAAA5Qg/UgA37F2XTCY0u_Cu0fghfppITmPZIokFwCNcBGAsYHQ/s0/b2.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine6, Buffer.from(line6, "utf-8"));

      Canvas.registerFont(process.cwd() + `/caches/MTOJamai.ttf`, {
        family: "MTOJamai"
      });

      let a = await loadImage(pathAva)
      let a1 = await loadImage(pathImg)
      let a2 = await loadImage(pathLine)
      let a3 = await loadImage(pathLine2)
      let l1 = await loadImage(pathLine3)
      let l2 = await loadImage(pathLine4)
      let b1 = await loadImage(pathLine5)
      let b2 = await loadImage(pathLine6)
      let u = await loadImage(pathLine7)
      let canvas = createCanvas(1080, 1920);
      let c1 = createCanvas(canvas.width, canvas.height);
      let c2 = createCanvas(canvas.width, canvas.height);
      let c3 = createCanvas(canvas.width, canvas.height);
      let c4 = createCanvas(canvas.width, canvas.height);
      let ctx = canvas.getContext("2d");
      let ctx1 = c1.getContext("2d");
      let ctx2 = c2.getContext("2d");
      let ctx3 = c3.getContext("2d");
      let ctx4 = c4.getContext("2d");

      ctx1.save();
      ctx1.drawImage(a1, 0, 0, canvas.width, canvas.height);
      ctx1.globalCompositeOperation = "source-in";
      ctx1.drawImage(a, -100, -1000, 1700, 1700);
      ctx1.restore();
      ctx2.save();
      ctx2.drawImage(a2, 0, 0, canvas.width, canvas.height);
      ctx2.globalCompositeOperation = "source-in";
      ctx2.drawImage(a, -500, -500, 1700, 1700);
      ctx2.restore();
      ctx3.save();
      ctx3.drawImage(a3, 0, 0, canvas.width, canvas.height);
      ctx3.globalCompositeOperation = "source-in";
      ctx3.drawImage(a, -550, 700, 1900, 1900);
      ctx3.restore();
      ctx4.save();
      ctx4.drawImage(b2, 0, 0, canvas.width, canvas.height);
      ctx4.globalCompositeOperation = "source-in";
      ctx4.fillStyle = color_;
      ctx4.fillRect(0, 0, canvas.width, canvas.height);
      ctx4.globalCompositeOperation = "destination-atop";
      ctx4.drawImage(b1, 0, 0, canvas.width, canvas.height);
      ctx4.restore();
      ctx.save();
      ctx.fillStyle = color_;
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(u, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(l1, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(c1, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(c2, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(c3, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(c4, -50, 130, 800, 800);
      ctx.drawImage(l2, 0, 0, canvas.width, canvas.height)
      ctx.restore();
      ctx.save();
      
      ctx.fillStyle = "#fff"
      ctx.font = "bold 80px MTO Jamai";
      ctx.transform(1, -0.1, 0, 1, 0, 0);
      ctx.textAlign = "center"
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 10;
      for (i = 0; i < 20; i++) {
        ctx.fillText(tenchinh, 370, 580);
        ctx.fillText(tenchinh, 370, 580 - 90);
        ctx.fillText(tenchinh, 370, 580 + 90);
      }
      ctx.restore();
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 10;
      ctx.drawImage(a, -150, 220, 1700, 1700)
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: "Ảnh Của Bạn Đây",
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        fs.unlinkSync(pathAva),
        fs.unlinkSync(pathLine),
        fs.unlinkSync(pathLine2),
        fs.unlinkSync(pathLine3),
        fs.unlinkSync(pathLine4),
        fs.unlinkSync(pathLine5),
        // fs.unlinkSync(pathLine6),
        fs.unlinkSync(pathLine7),
        event.messageID
      );
    }
    else if (type == 6) {
      let line1 = (await axios.get(encodeURI(`https://imgur.com/g2xNV2C.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(line, Buffer.from(line1, "utf-8"));
      let background = (await axios.get(encodeURI(`https://imgur.com/qBMs0FN.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
      let ava = (await axios.get(encodeURI(`${lengthchar[char].imgAnime}`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, Buffer.from(ava, "utf-8"));
      let icon3 = (await axios.get(encodeURI(`https://imgur.com/38Ws4qZ.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathIcongithub, Buffer.from(icon3, "utf-8"));
      let liness = (await axios.get(encodeURI(`https://imgur.com/UxQ5Z0u.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathLine, Buffer.from(liness, "utf-8"));
      let icon = (await axios.get(encodeURI(`https://imgur.com/zmMas6s.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathIcon, Buffer.from(icon, "utf-8"));
      let icon2 = (await axios.get(encodeURI(`https://imgur.com/QsJPESz.png`), { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathIconIG, Buffer.from(icon2, "utf-8"));

      Canvas.registerFont(process.cwd() + `/caches/phenomicon.ttf`, {
        family: "phenomicon"
      });
      Canvas.registerFont(process.cwd() + `/caches/EBGaramond-VariableFont_wght.ttf`, {
        family: "BGaramond-VariableFont_wght"
      });
      Canvas.registerFont(process.cwd() + `/caches/SVN-Big Noodle Titling.otf`, {
        family: "time"
      });

      let l1 = await loadImage(pathAva);
      let a = await loadImage(pathImg);
      let p = await loadImage(pathLine);
      let l = await loadImage(line);
      let g = await loadImage(pathIcon);
      let r = await loadImage(pathIconIG);
      let o = await loadImage(pathIcongithub);
      let canvas = createCanvas(a.width, a.height);
      var ctx = canvas.getContext("2d");

      ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(l1, -100, -70, 1000, 1000);
      ctx.beginPath();
      ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(p, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = color_;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.drawImage(g, 1153, 690, 50, 50);
      ctx.drawImage(r, 1209, 692, 50, 50);
      ctx.drawImage(o, 1255, 680, 75, 75);
      
      ctx.textAlign = "start";
      ctx.strokeStyle = color_;
      ctx.filter = "brightness(90%) contrast(110%)";
      ctx.font = "150px phenomicon";
      ctx.fillText(tenchinh, 790, 390);
      ctx.restore();
      ctx.save();
      ////
      ctx.textAlign = "start";
      ctx.fillStyle = color_;
      ctx.font = "70px phenomicon"
      ctx.fillText(subname, 1200, 450)
      
      ctx.font = "30px BGaramond-VariableFont_wght"
      ctx.fillStyle = color_;
      const abc = await this.wrapText(ctx, reply.fact, 750);
      ctx.fillText(abc.join('\n'), 790, 550)
      ////
      ctx.textAlign = "start";
      ctx.fillStyle = "#ffff";
      ctx.font = "35px time"
      const xyz = await this.wrapText(ctx, reply.abcxyzlm, 300);
      ctx.fillText(xyz.join('\n'), 790, 739)
      ctx.textAlign = "start";
      ctx.fillStyle = "#B6D6F2";
      ctx.font = "35px time"
      ctx.fillText("@manhkhac", 1340, 730)
      ctx.globalAlpha = 0.5
      ctx.drawImage(l, 0, 0, l.width, l.height);
      ctx.save()
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      return api.sendMessage({
        body: "Ảnh Của Bạn Đây",
        attachment: fs.createReadStream(pathImg)
      },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        fs.unlinkSync(pathAva),
        fs.unlinkSync(pathLine),
        fs.unlinkSync(pathIconIG),
        fs.unlinkSync(pathIcongithub),
        fs.unlinkSync(line),
        event.messageID
      );
    }
  }
}