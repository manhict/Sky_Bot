import https from 'https'

process.setMaxListeners(Infinity);
export default function ({ logger, Config }) {
  if (Config['UPTIMEROBOT'] == true) {
    if (process.env.REPL_OWNER !== undefined) {
      var urlRepl = `https://${process.env.REPL_SLUG}.${username}.repl.co`;
      logger.log(global.getText('CHECK_HOST', urlRepl), 'CHECK HOST');
      if (process.env.REPLIT_CLUSTER == 'hacker') return logger(global.getText('HACKER_PLAN'), 'CHECK HOST');
      else {
        logger.log(global.getText('HOST_FREE'), 'CHECK HOST');
        connectUptime(urlRepl);
      }
    }
    else if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_SERVICE_SKYBOT_URL) {
      var urlRailway = `https://${process.env.RAILWAY_STATIC_URL}` ||
        `https://${process.env.RAILWAY_SERVICE_SKYBOT_URL}`;
      connectUptime(urlRailway);
    }
    else return logger.error(global.getText('HOST_FALSE'));
  }

  function connectUptime(url) {
    setInterval(() => {
      https.get(url, res => {
        let data = [];
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        // logger.log('Status Code: ' + res.statusCode, 'UPTIMEROBOT');
        // logger.log('Date in Response header: ' + headerDate, 'UPTIMEROBOT');

        res.on('data', chunk => {
          data.push(chunk);
        });

        res.on('end', () => {
          return data;
          // logger.log('Successfully sent uptime ping!', 'UPTIMEROBOT');
        });
      }).on('error', err => {
        logger.log('Error uptime: ' + err.message, 'UPTIMEROBOT');
      });
    }, 600000);
  }
}
