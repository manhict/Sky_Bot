import axios from 'axios';
import moment from 'moment-timezone';
import Canvas from 'canvas';
import fs from 'fs';

function convertFtoC(F) {
    return Math.floor((F - 32) / 1.8);
}
function formatHours(hours) {
    return moment(hours).tz("Asia/Ho_Chi_Minh").format("HH[h]mm[p]");
}

const
    config = {
        name: 'thoitiet',
        version: '1.0.0',
        role: 0,
        author: ['Sky'],
        viDesc: 'Xem thời tiết trong 5 ngày.',
        enDesc: 'Weather in 5 days',
        category: ['Tin tức', 'Social'],
        usages: "[Location]",
        timestamp: 0,
        envGlobal: {
            weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4"
        }
    },

    languages = {
        "vi_VN": {
            syntaxError: "Vui lòng nhập địa điểm",
            notFound: "Không thể tìm thấy địa điểm: %1",
            error: "Đã xảy ra lỗi: %1",
            today: "Thời tiết hôm nay:\n%1\n🌡 Nhiệt độ thấp nhất - cao nhất %2°C - %3°C\n🌡 Nhiệt độ cảm nhận được %4°C - %5°C\n🌅 Mặt trời mọc %6\n🌄 Mặt trời lặn %7\n🌃 Mặt trăng mọc %8\n🏙️ Mặt trăng lặn %9\n🌞 Ban ngày: %10\n🌙 Ban đêm: %11"
        },
        "en_US": {
            syntaxError: "Please enter a location",
            notFound: "Location not found: %1",
            error: "An error has occurred: %1",
            today: "Today's weather:\n%1\n🌡 Low - high temperature %2°C - %3°C\n🌡 Feels like %4°C - %5°C\n🌅 Sunrise %6\n🌄 Sunset %7\n🌃 Moonrise %8\n🏙️ Moonset %9\n🌞 Day: %10\n🌙 Night: %11"
        }
    },

    onMessage = async function ({ args, message, envGlobal, getText }) {
        const apikey = envGlobal.weatherApiKey;
        var pathBgWeather = process.cwd() + "/caches/thoitiet.jpeg";
        var pathSaveImg = `${process.cwd()}/caches/weather_${Date.now()}.jpeg`;
        var pathFont = process.cwd() + "/caches/Play-Bold.ttf";

        if (!fs.existsSync(pathBgWeather)) {
            let getbg = (await axios.get(`https://i.imgur.com/1Rx88Te.jpg`, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(pathBgWeather, Buffer.from(getbg, "utf-8"));
        }
        if (!fs.existsSync(pathFont)) {
            let getfont = (await axios.get("https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download", {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(pathFont, Buffer.from(getfont, "utf-8"));
        };

        Canvas.registerFont(
            pathFont, {
            family: "Play-Bold"
        });

        const area = args.join(" ");
        if (!area)
            return message.reply(getText("syntaxError"));
        let areaKey, dataWeather;

        try {
            const response = (await axios.get(`https://api.accuweather.com/locations/v1/cities/search.json?q=${encodeURIComponent(area)}&apikey=${apikey}&language=vi-vn`)).data;
            if (response.length == 0)
                return message.reply(getText("notFound", area));
            const data = response[0];
            areaKey = data.Key;
        }
        catch (err) {
            return message.reply(getText("error", err.response.data.Message));
        }

        try {
            dataWeather = (await axios.get(`http://api.accuweather.com/forecasts/v1/daily/10day/${areaKey}?apikey=${apikey}&details=true&language=vi`)).data;
        }
        catch (err) {
            return message.reply(`❌ Error: ${err.response.data.Message}`);
        }

        const dataWeatherDaily = dataWeather.DailyForecasts;
        const dataWeatherToday = dataWeatherDaily[0];
        const msg = getText("today", dataWeather.Headline.Text, convertFtoC(dataWeatherToday.Temperature.Minimum.Value), convertFtoC(dataWeatherToday.Temperature.Maximum.Value), convertFtoC(dataWeatherToday.RealFeelTemperature.Minimum.Value), convertFtoC(dataWeatherToday.RealFeelTemperature.Maximum.Value), formatHours(dataWeatherToday.Sun.Rise), formatHours(dataWeatherToday.Sun.Set), formatHours(dataWeatherToday.Moon.Rise), formatHours(dataWeatherToday.Moon.Set), dataWeatherToday.Day.LongPhrase, dataWeatherToday.Night.LongPhrase);

        const bg = await Canvas.loadImage(pathBgWeather);
        const { width, height } = bg;
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bg, 0, 0, width, height);
        let X = 100;
        ctx.fillStyle = "#ffffff";
        const data = dataWeather.DailyForecasts.slice(0, 7);
        for (const item of data) {
            const icon = await Canvas.loadImage("http://vortex.accuweather.com/adc2010/images/slate/icons/" + item.Day.Icon + ".svg");
            ctx.drawImage(icon, X, 210, 80, 80);

            ctx.font = "30px BeVietnamPro-SemiBold";
            const maxC = `${convertFtoC(item.Temperature.Maximum.Value)}°C `;
            ctx.fillText(maxC, X, 366);

            ctx.font = "30px BeVietnamPro-Regular";
            const minC = String(`${convertFtoC(item.Temperature.Minimum.Value)}°C`);
            const day = moment(item.Date).format("DD");
            ctx.fillText(minC, X, 445);
            ctx.fillText(day, X + 20, 140);

            X += 135;
        }

        fs.writeFileSync(pathSaveImg, canvas.toBuffer());

        return message.reply({
            body: msg,
            attachment: fs.createReadStream(pathSaveImg)
        }, () => fs.unlinkSync(pathSaveImg));

    }

export { config, languages, onMessage };