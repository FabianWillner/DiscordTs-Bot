import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "kick",
    description: "Poggers",
    execute(message: Discord.Message, context: argumentWrapper) {
        if (!message.mentions.users.size) {
            message.reply("you need to tag a user in order to kick them!");
            return;
        }
        const taggedUser: Discord.User = message.mentions.users.first();

        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    },
};
