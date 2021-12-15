import fs from "fs";
import * as Discord from "discord.js";
import { commands } from "../../helperStructures/commands.js";

export default {
    name: "reload",
    description: "Reloads a command",
    args: true,
    execute(message: Discord.Message, args: string[]) {
        let commandName: string = args[0].toLowerCase();
        const command =
            commands.get(commandName) ||
            commands.find((cmd) => {
                if (!cmd.aliases) {
                    return false;
                } else {
                    return cmd.aliases.includes(commandName);
                }
            });
        if (!command) {
            return message.channel.send(
                `There is no command with name or alias \`${commandName}\`, ${message.author.username}!`
            );
        }
        commandName = command.name;
        const projectPath = `${__dirname}\\..\\..\\..\\..`;
        const commandPath = `${projectPath}\\src\\commands`;
        const commandFolders: string[] = fs.readdirSync(commandPath);
        const folderName: string | undefined = commandFolders.find((folder) =>
            fs
                .readdirSync(`${commandPath}\\${folder}`)
                .includes(`${commandName}.ts`)
        );
        if (!folderName) {
            return message.channel.send(
                `There is no file with name \`${commandName}.ts\`, ${message.author.username}!`
            );
        }
        // execute a cmd command
        const { execSync } = require("child_process");
        execSync(
            `tsc --outdir ${projectPath}\\build\\src ${commandPath}\\${folderName}\\${commandName}.ts --preserveConstEnums true --resolveJsonModule true`
        );

        delete require.cache[
            require.resolve(`../${folderName}/${commandName}.js`)
        ];

        try {
            const newCommand = require(`..\\${folderName}\\${commandName}.js`);
            commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${commandName}\` was reloaded!`);
        } catch (error: any) {
            console.error(error);
            message.channel.send(
                `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``
            );
        }
    },
};
