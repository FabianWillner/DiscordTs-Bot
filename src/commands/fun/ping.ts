import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "ping",
    description: "Ping!",
    execute(message: Discord.Message, context: argumentWrapper) {
        message.channel.send("Pong.");
    },
};
