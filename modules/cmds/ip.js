export const config = {
    name: 'ip',
    version: '1.0.0',
    role: 0,
    author: ['Sky'],
    viDesc: 'lấy thông tin vùng qua ip.',
    enDesc: 'Get information about IP.',
    category: ['Tìm kiếm', 'Search'],
    usages: '',
    timestamp: 0
};

import fetch from 'node-fetch'
import https from 'https'

export async function onMessage({ api, event, args }) {
    var input = args.join(" ");
    const response = await fetch(`http://ip-api.com/json/${input}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`);
    const data = await response.json();
    if (data.status == 'fail') {
        return api.sendMessage(data.status, event.threadID);
    } else {
        api.sendMessage({
            body: `=== ${data.isp} ===\n\n🌍Lục địa: \n🏷Tên vùng: ${data.regionName}
            \n🏴‍Quốc gia:${data.country}\n🗺️Khu vực: ${data.region}\n🏞Thành Phố: ${data.city}
            \n🏛Mã quốc gia: ${data.countryCode}\n⛽️Mã zip: ${data.zip}\n⏱Múi giờ: ${data.timezone}
            \n💵Đơn vị Tiền: ${data.currency}\n📉Kinh độ: ${data.lon}\n📈Vĩ độ: ${data.lat}
            \n 🔍Tên tổ chức: ${data.org}\n👀Truy vấn: ${data.query}\n`,
            location: {
                latitude: data.lat,
                longitude: data.lon,
                current: true
            }
        }, event.threadID);
    }

}