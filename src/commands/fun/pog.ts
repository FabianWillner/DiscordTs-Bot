import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "pog",
    description: "Poggers",
    execute(message: Discord.Message, context: argumentWrapper) {
        const wasweisich: Discord.GuildEmoji = message.client.emojis.cache.find(
            (emoji) => emoji.name === "swagtaube"
        );
        message.channel.send(wasweisich.toString());
    },
};
