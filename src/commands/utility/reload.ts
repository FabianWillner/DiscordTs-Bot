import fs = require("fs");
import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "reload",
    description: "Reloads a command",
    args: true,
    execute(message: Discord.Message, context: argumentWrapper) {
        const { args, commands } = context;
        const commandName: string = args[0].toLowerCase();
        const command =
            commands.get(commandName) ||
            commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

        if (!command) {
            return message.channel.send(
                `There is no command with name or alias \`${commandName}\`, ${message.author.username}!`
            );
        }

        const commandFolders: string[] = fs.readdirSync("./src/commands");
        const folderName: string = commandFolders.find((folder) =>
            fs
                .readdirSync(`./src/commands/${folder}`)
                .includes(`${commandName}.ts`)
        );

        // execute a cmd command
        const { execSync } = require("child_process");
        execSync(`tsc ${__dirname}\\..\\${folderName}\\${command.name}.ts`);

        delete require.cache[
            require.resolve(`../${folderName}/${command.name}.js`)
        ];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(
                `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
            );
        }
    },
};
