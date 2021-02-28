import { argumentWrapper } from "../interfaces/wrapperObject";
import { logger } from "../logger/logger"

module.exports = {
    name: "ready",
    once: true,
    execute(context: argumentWrapper) {
        const { client } = context;

        client.user.setActivity("YOU!!!", { type: "WATCHING" });
        logger.initializeLogger(client.user.username);
        logger.log("info", "The bot is online!");
        //client.user.setStatus('dnd');
        //client.user.setStatus('invisible');
    },
};
