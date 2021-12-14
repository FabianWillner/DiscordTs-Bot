import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "pog",
    description: "Poggers",
    execute(message: Discord.Message, context: argumentWrapper) {
        const wasweisich: Discord.GuildEmoji | undefined  = message.client.emojis.cache.find(
            (emoji) => emoji.name === "swagtaube"
        );
        if (wasweisich !== undefined){
            message.channel.send(wasweisich.toString());
        }
    },
};
