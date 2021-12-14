import * as Discord from "discord.js";
import * as fs from "fs";
import { argumentWrapper } from "./interfaces/wrapperObject";
import { command } from "./interfaces/command";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export class Bot {
    private client: Discord.Client;
    private commands: Discord.Collection<string, command>;

    constructor(token: string, clientId: string) {
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
        this.login(token);
        this.loadCommands();
        this.loadSlashcommands(clientId)
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
            console.log(file);
            const event = require(`./events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) =>
                    event.execute(...args, context)
                );
            } else {
                console.log(event.name)
                this.client.on(event.name, (...args) =>
                    event.execute(...args, context)
                );
            }
        }
    }

    private async loadSlashcommands(clientId: string){
        const commands = [];
        const commandFiles = fs.readdirSync('./build/src/slashcommands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./slashcommands/${file}`);
            if (command.data){
                commands.push(command.data.toJSON());
            } else {
                console.log("command.data is empty")
            }
            
        }
        const rest = new REST({ version: '9' });
        if (this.client.token !== null){
            rest.setToken(this.client.token);
        }
        
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
        
                await rest.put(
                    Routes.applicationGuildCommands(clientId, "505286054681640960"),
                    //Routes.applicationCommands(clientId),
                    { body: commands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
