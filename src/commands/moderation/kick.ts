import * as Discord from "discord.js";

export default {
    name: "kick",
    description: "Poggers",
    execute(message: Discord.Message, args: string[]) {
        if (!message.mentions.users.size) {
            message.reply("you need to tag a user in order to kick them!");
            return;
        }
        const taggedUser: Discord.User | undefined = message.mentions.users.first();

        if (taggedUser !== undefined){
            message.channel.send(`You wanted to kick: ${taggedUser.username}`);
        }
    },
};
