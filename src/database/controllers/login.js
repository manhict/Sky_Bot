"use strict";

import mongoose from "mongoose"
mongoose.set('strictQuery', true);

import threadsModel from "../models/threadsModel.js"
import usersModel from "../models/usersModel.js"

export default async function({ logger }) {
    const { config } = global.client;
    const databaseType = config.DATABASE.type;
    if (databaseType == "mongodb" && config.DATABASE.uriMongodb) {
        logger.log('\x1b[1;36m' + global.getText('CHOOSE_DATABASE'), 'MONGODB');
        const P = "\\|/-";
        let ij = 0;
        const loadmongo = setInterval(() => {
            logger.log(P[ij++] + global.getText('CONNECTION_DATABASE'), "MONGODB");
            ij %= P.length;
        }, 480);

        const uriConnect = config.DATABASE.uriMongodb;
        await mongoose.connect(uriConnect, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(result => {
                logger.log("\x1b[1;33m" + global.getText('CONNECTION_DATABASE_SUCCESS') + '\n', "MONGODB");
                clearInterval(loadmongo);
            })
            .catch(err => {
                logger.error(global.getText('CONNECTION_DATABASE_FAILED', err.stack + '\n'), "MONGODB");
                clearInterval(loadmongo);
                process.exit(0);
            });

        if ((await threadsModel.find({ type: "thread" })).length == 0) await threadsModel.create({
            type: "thread",
            data: Object
        });

        if ((await usersModel.find({ type: "user" })).length == 0) await usersModel.create({
            type: "user",
            data: Object
        });
    }
}
