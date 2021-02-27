import { argumentWrapper } from "../interfaces/wrapperObject";
import * as Winston from "winston";

module.exports = {
    name: "ready",
    once: true,
    execute(context: argumentWrapper) {
        const { client } = context;

        client.user.setActivity("YOU!!!", { type: "WATCHING" }).then(() => {
            context.logger = Winston.createLogger({
                transports: [
                    new Winston.transports.Console(),
                    new Winston.transports.File({
                        filename: `./logs/${client.user.username}/error.log`,
                        level: "error",
                    }),
                    new Winston.transports.File({
                        filename: `./logs/${client.user.username}/debug.log`,
                        level: "debug",
                    }),
                    new Winston.transports.File({
                        filename: `./logs/${client.user.username}/info.log`,
                    }),
                ],
                format: Winston.format.combine(
                    Winston.format.timestamp({
                        format: "YYYY-MM-DD HH:mm:ss",
                    }),
                    Winston.format.printf(
                        (log) =>
                            `[${log.level.toUpperCase()}]\t[${log.timestamp}] [${
                                client.user.username
                            }] - ${log.message}`
                    )
                ),
            });

            context.logger.log("info", "The bot is online!");
        });
        //client.user.setStatus('dnd');
        //client.user.setStatus('invisible');
    },
};
