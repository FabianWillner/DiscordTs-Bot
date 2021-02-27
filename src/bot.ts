import * as Discord from "discord.js";
import * as fs from "fs";
import { argumentWrapper } from "./interfaces/wrapperObject";
import { command } from "./interfaces/command";
import { YoutubePlayer } from "./youtubePlayer";
import * as Winston from "winston";

export class Bot {
    private client: Discord.Client;
    private commands: Discord.Collection<string, command>;
    private youtubePlayer: YoutubePlayer;
    private logger: Winston.Logger;

    constructor(token: string) {
        this.initBot(token);
    }

    private login(token: string) {
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

    private async loadEvents() {
        const context: argumentWrapper = {
            commands: this.commands,
            client: this.client,
            youtubePlayer: this.youtubePlayer,
            logger: this.logger,
        };
        const eventFiles = fs
            .readdirSync("./src/events")
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

    private initBot(token: string) {
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
        this.youtubePlayer = new YoutubePlayer(this.logger);

        this.loadCommands();
        this.loadEvents();
        this.login(token);
    }
}
