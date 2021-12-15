import * as Discord from "discord.js";
import * as fs from "fs";
import { argumentWrapper } from "./interfaces/wrapperObject";
import { command } from "./interfaces/command";

export class Bot {
    private client: Discord.Client;
    private commands: Discord.Collection<string, command>;

    constructor(token: string) {
        this.client = new Discord.Client({
            intents: new Discord.Intents(32767),
        });
        this.commands = new Discord.Collection();
        this.login(token);
        this.loadCommands();
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
                const command = require(`./commands/${folder}/${file}`);
                this.commands.set(command.name, command);
            }
        }
    }

    private async loadEvents() {
        const context: argumentWrapper = {
            commands: this.commands,
            client: this.client,
        };
        const eventFiles = fs
            .readdirSync("./build/src/events")
            .filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`./events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) =>
                    event.execute(...args, context)
                );
            } else {
                this.client.on(event.name, (...args) =>
                    event.execute(...args, context)
                );
            }
        }
    }
}
