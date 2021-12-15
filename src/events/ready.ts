import * as Discord from "discord.js";
import { argumentWrapper } from "../interfaces/wrapperObject";
import { logger } from "../logger/logger";

module.exports = {
    name: "ready",
    once: true,
    execute(client: Discord.Client) {
        if (!client.user) {
            return;
        }
        client.user.setActivity("YOU!!!", { type: "WATCHING" });
        logger.initializeLogger(client.user.username);
        logger.log("info", "The bot is online!");
        //client.user.setStatus('dnd');
        //client.user.setStatus('invisible');
    },
};
