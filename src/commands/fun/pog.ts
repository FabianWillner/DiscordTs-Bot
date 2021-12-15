import * as Discord from "discord.js";

export default {
    name: "pog",
    description: "Poggers",
    execute(message: Discord.Message, args: string[]) {
        const wasweisich: Discord.GuildEmoji | undefined =
            message.client.emojis.cache.find(
                (emoji) => emoji.name === "swagtaube"
            );
        if (wasweisich !== undefined) {
            message.channel.send(wasweisich.toString());
        }
    },
};
