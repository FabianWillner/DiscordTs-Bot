import { prefix, token } from "../credentials.json";
import * as Discord from "discord.js";
import * as fs from "fs";

export class Bot {
    private client: Discord.Client;
    private commands: Discord.Collection<string, any>;

    constructor() {
        this.initBot();
    }

    private login() {
        this.client.login(token);
    }

    private async loadCommands() {
        const commandFolders = fs.readdirSync("./src/commands");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`./commands/${folder}/${file}`);
                this.commands.set(command.name, command);
            }
        }
    }

    private initBot() {
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
        this.loadCommands();

        this.client.once("ready", () => {
            console.log("Ready!");
        });

        this.client.on("message", (message) => {
            if (!message.content.startsWith(prefix) || message.author.bot)
                return;
            const args: string[] = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/);
            const commandName: string = args.shift().toLowerCase();

            const command =
                this.commands.get(commandName) ||
                this.commands.find(
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


            try {
                command.execute(message, args, this.commands);
            } catch (error) {
                console.error(error);
                message.reply(
                    "there was an error trying to execute that command!"
                );
            }

            console.log(message.content);
        });
        this.login();
    }
}
