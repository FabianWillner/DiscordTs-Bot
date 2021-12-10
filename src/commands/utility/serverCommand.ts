import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "servercommand",
    aliases: ["server"],
    description: "Displays some information about the server",
    execute(message: Discord.Message, context: argumentWrapper) {
        message.channel.send(`Server name: ${message.guild.name}\n`
        +`Total members: ${message.guild.memberCount}`);
    },
};
