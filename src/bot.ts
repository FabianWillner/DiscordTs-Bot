import * as Discord from "discord.js";
import * as fs from "fs";
import { slashcommands } from "./helperStructures/slashcommands.js";
import { commands } from "./helperStructures/commands.js";

export class Bot {
    private client: Discord.Client;

    constructor(token: string) {
        this.client = new Discord.Client({
            intents: new Discord.Intents(32767),
        });
        this.login(token);
        this.loadCommands();
        this.loadSlashCommands();
        this.loadEvents();
    }

    private login(token: string) {
        this.client.login(token);
    }

    private async loadCommands() {
        const commandFolders = fs.readdirSync("./build/src/commands");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./build/src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const { default: command } = await import(
                    `./commands/${folder}/${file}`
                );
                commands.set(command.name, command);
            }
        }
    }

    private async loadSlashCommands() {
        const commandFolders = fs.readdirSync("./build/src/slashcommands");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./build/src/slashcommands/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const { command } = await import(
                    `./slashcommands/${folder}/${file}`
                );
                if (command) {
                    slashcommands.set(file.replace(".js", ""), command);
                }
            }
        }
    }

    private async loadEvents() {
        const eventFiles = fs
            .readdirSync("./build/src/events")
            .filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const { default: event } = await import(`./events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) =>
                    event.execute(...args)
                );
            } else {
                this.client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}
