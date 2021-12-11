import fs = require("fs");
import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "reload",
    description: "Reloads a command",
    args: true,
    execute(message: Discord.Message, context: argumentWrapper) {
        const { args, commands } = context;
        let commandName: string = args[0].toLowerCase();
        const command =
            commands.get(commandName) ||
            commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

        commandName = command.name;
        if (!command) {
            return message.channel.send(
                `There is no command with name or alias \`${commandName}\`, ${message.author.username}!`
            );
        }
        const projectPath = `${__dirname}\\..\\..\\..\\..`;
        const commandPath = `${projectPath}\\src\\commands`;
        const commandFolders: string[] = fs.readdirSync(commandPath);
        const folderName: string = commandFolders.find((folder) =>
            fs
                .readdirSync(`${commandPath}\\${folder}`)
                .includes(`${commandName}.ts`)
        );
        // execute a cmd command
        const { execSync } = require("child_process");
        execSync(
            `tsc --outdir ${projectPath}\\build\\src ${commandPath}\\${folderName}\\${command.name}.ts --preserveConstEnums true --resolveJsonModule true`
        );

        delete require.cache[
            require.resolve(`../${folderName}/${command.name}.js`)
        ];

        try {
            const newCommand = require(`..\\${folderName}\\${command.name}.js`);
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
