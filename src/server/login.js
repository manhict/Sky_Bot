import fs from "fs"
import login from "api-social"
import readline from "readline"
import totp from "totp-generator"
import getLang from "../function/getLang.js";
import * as logger from "../function/logger.js"
import { Start } from "../system/spawn.js"
import { createRequire } from "module"
const require = createRequire(import.meta.url)

let configLogin = "";
let argv = process.argv.slice(2);
if (argv.length !== 0) configLogin = argv[0];
else configLogin = require("../../config/configLogin.json");
let configMain = require("../../config/configMain.json");

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const option = {
	logLevel: "silent",
	forceLogin: true,
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
};

let email = configLogin.EMAIL;
let password = configLogin.PASSWORD;
let otpkey = configLogin.OPTKEY.code.replace(/\s+/g, '').toUpperCase();

if (configLogin['HEADLESS'] == true) {
	login({ email, password }, option, (err, api) => {
		if (err) {
			switch (err.error) {
				case "login-approval":
					let code = (totp(otpkey));
					logger.log(code, "OTPKEY");
					if (otpkey) err.continue(code);
					else {
						console.log("Nhập mã xác minh 2 lớp:");
						rl.on("line", line => {
							err.continue(line);
							rl.close();
						});
					}
					break;
				default:
					logger.error(getLang('LOGIN_ERROR'), 'Login');
					Start("Restarting...");
			}
			return;
		}
		logger.log(getLang('CREATE_FBSTATE'), 'write fbstate');
		const json = JSON.stringify(api.getAppState(), null, 2);
		fs.writeFileSync(configMain['DATA_APPSTATE'] + '.json', json);
		Start("Restarting...");
	});
}
else Start("Restarting...");