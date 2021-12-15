import credentials from "../../credentials.json";
import * as Discord from "discord.js";
import { logger } from "../logger/logger.js";
import { commands } from "../helperStructures/commands.js";

export default {
    name: "messageCreate",
    execute(message: Discord.Message) {
        if (
            !message.content.startsWith(credentials.prefix) ||
            message.author.bot
        )
            return;
        logger.log(
            "info",
            `${message.author.username}: ${message.cleanContent}`
        );
        const args: string[] = message.content
            .slice(credentials.prefix.length)
            .trim()
            .split(/ +/);
        const commandName: string | undefined = args.shift()?.toLowerCase();
        if (!commandName) {
            return;
        }
        const command =
            commands.get(commandName) ||
            commands.find((cmd) => {
                if (!cmd.aliases) {
                    return false;
                } else {
                    return cmd.aliases.includes(commandName);
                }
            });
        if (!command) return;
        logger.log("debug", `${message.author.username}: used ${commandName}`);

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author.username}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${credentials.prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        try {
            command.execute(message, args);
        } catch (error) {
            logger.log(
                "error",
                `the message ${message.content} has thrown: ${error}`
            );
            //console.error(error);
            message.reply("there was an error trying to execute that command!");
        }
    },
};
