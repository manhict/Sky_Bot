import fetch from "node-fetch";
import axios from "axios";
import cliProgress from "cli-progress";
import chalk from "chalk";
import unzipper from "unzipper";
import os from "os";
import { exec } from "child_process";
import fs from "fs";
import { Start } from "../system/spawn.js"
import Login from "../server/login.js";

/**
 * Tải xuống và giải nén file từ URL được cung cấp.
 * @param {string} fileUrl - URL của file cần tải xuống và giải nén.
 * @param {string} fileName - Tên của file tải xuống.
 * @param {string} extractDir - Tên thư mục để giải nén file.
 * @param {object} openFileNames - Một đối tượng chứa tên file exe cho mỗi hệ điều hành.
 */
async function downloadAndUnzip(fileUrl, fileName, extractDir, openFileNames) {
    // Khởi tạo thanh tiến trình
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    try {
        // Tải xuống file bằng axios
        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream'
        });
        // Lấy kích thước file để tính phần trăm hoàn thành
        const totalSize = response.headers['content-length'];

        // Pipe stream response vào file tương ứng
        response.data.pipe(fs.createWriteStream(fileName))
            .on('finish', () => {
                console.log(chalk.white(`\n- File ${fileName} đã được tải xuống thành công.`));

                // Giải nén file bằng unzipper
                fs.createReadStream(fileName)
                    .pipe(unzipper.Extract({ path: extractDir }))
                    .on('close', () => {
                        console.log(chalk.white(`- File ${fileName} đã được giải nén vào thư mục ${extractDir}.`));

                        // Mở thư mục chứa file exe tương ứng với hệ điều hành đang chạy
                        console.log(chalk.white(`- Đang mở thư mục chứa App`));
                        console.log(chalk.white(`- Tự đông đóng App sau 5 giây.`));
                        fs.unlinkSync(fileName);
                        setTimeout(() => {
                            switch (os.platform()) {
                                case 'win32':
                                    exec(`start ${extractDir}`);
                                    Start('Loading...');
                                    break;
                                case 'darwin':
                                    exec(`open -a Terminal.app ${extractDir}`);
                                    Start('Loading...');
                                    break;
                                case 'linux':
                                    exec(`gnome-terminal --working-directory=${extractDir}`);
                                    Start('Loading...');
                                    break;
                                default:
                                    console.error(chalk.red(`Không hỗ trợ hệ điều hành: ${os.platform()}`));
                                    return;
                            }
                        }, 5000);
                    })
                    .on('error', (error) => {
                        console.error(chalk.red(`Lỗi khi giải nén file: ${error.message}`));
                    });
            })
            .on('error', (error) => {
                console.error(chalk.red(`Lỗi khi tải xuống file: ${error.message}`));
            });

        // Cập nhật thanh tiến trình
        progressBar.start(totalSize, 0);
        response.data.on('data', (chunk) => {
            progressBar.increment(chunk.length);
        });
        response.data.on('end', () => {
            progressBar.stop();
        });
    } catch (error) {
        console.error(chalk.red(`Lỗi khi tải xuống file: ${error.message}`));
    }
}

const checkUpdate = async (VERSION) => {
    try {
        let SEVER_MAIN = 'https://raw.githubusercontent.com/manhict/skyBot_Data/main/update.json';
        const response = await fetch(SEVER_MAIN, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }).then(r => r.json())
        let SKYBOT = response['SkyBot'];
        if (SKYBOT.status == true) {
            if (SKYBOT.versionNew > VERSION) {
                console.log(chalk.blue(`- Phiên bản mới ${chalk.white(`v${SKYBOT.versionNew}`)} đã được phát hành, vui lòng cập nhật phiên bản mới nhất!`));
                console.log(chalk.yellow('- Nội dung: ' + SKYBOT.update.content));
                if (SKYBOT.update.status == true) {
                    let linkUpdate = SKYBOT.update.linkUpdate;
                    let fileZip = SKYBOT.update.fileZip;
                    let fileName = SKYBOT.update.openFileNames;
                    console.log(chalk.yellow('\n- Link cập nhật:', chalk.white(linkUpdate)));
                    console.log(chalk.bgMagenta('\n- Đang tự động tải xuống cập nhật. Vui lòng chờ trong giây lát...'));
                    console.log('\n')
                    // Tải xuống file cập nhật
                    return downloadAndUnzip(linkUpdate, fileZip, process.cwd(), fileName);
                }
                // return true
            }
            // console.log(chalk.yellowBright(`- Bạn đang sử dụng sever ${indexSever + 1}`));
            if (SKYBOT.versionNew >= VERSION) {
                var pb = 'là phiên bản mới nhất!';
            } else var pb = 'là phiên bản cũ, vui lòng cập nhật phiên bản mới nhất!';
            let _content = SKYBOT.update.content;
            let rdContent = _content[Math.floor(Math.random() * _content.length)];

            console.log(chalk.cyanBright(`- Phiên bản hiện tại ${chalk.white(`v${SKYBOT.versionNew}`)} ${pb}`));
            console.log(chalk.cyanBright(`- Thông báo: ${rdContent}`));
            console.log('\n')
            return Login();
        }
        // return true
    } catch (err) {
        console.log(err.stack); //DEV
        console.log(chalk.red('- Lỗi khi kiểm tra phiên bản, vui lòng kiểm tra lại kết nối mạng!, đang thoát chương trình sau 3s...!'));
        return setTimeout(function () {
            process.exit(0);
        }, 3500);
    }
}

export default checkUpdate