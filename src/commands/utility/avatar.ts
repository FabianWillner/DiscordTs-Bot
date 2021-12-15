import * as Discord from "discord.js";

export default {
    name: "avatar",
    aliases: ["icon", "pfp"],
    description:
        "Shows the users avatar, use @Username to show the avatar of the User",
    execute(message: Discord.Message, args: string[]) {
        if (!message.mentions.users.size) {
            return message.channel.send(
                `${message.author.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                })}`
            );
        }
        const avatarList: string[] = message.mentions.users.map((user) => {
            return `${user.displayAvatarURL({
                format: "png",
                dynamic: true,
            })}`;
        });

        // send the entire array of strings as a message
        message.channel.send(avatarList.join("\n"));
    },
};
