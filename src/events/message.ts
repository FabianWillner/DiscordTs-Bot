import { Console } from "node:console";
import { prefix } from "../../credentials.json";
import * as Discord from "discord.js";

module.exports = {
    name: "message",
    execute(message, commands: Discord.Collection<string, any>) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args: string[] = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/);
        const commandName: string = args.shift().toLowerCase();
        console.log(commandName);
        const command =
            commands.get(commandName) ||
            commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );
        if (!command) return;

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

		console.log(args);
        try {
            command.execute(message, args, commands);
        } catch (error) {
            console.error(error);
            message.reply("there was an error trying to execute that command!");
        }

        console.log(message.content);
    },
};
