import * as Discord from "discord.js";

export default {
    name: "servercommand",
    aliases: ["server"],
    description: "Displays some information about the server",
    execute(message: Discord.Message, args: string[]) {
        message.channel.send(
            `Server name: ${message.guild?.name}\n` +
                `Total members: ${message.guild?.memberCount}`
        );
    },
};
