import { prefix, token } from "../credentials.json";
import Discord = require("discord.js");

export class Bot {
    private client: Discord.Client;

    constructor() {
        this.initBot();
    }

    private login() {
        this.client.login(token);
    }

    private initBot() {
        this.client = new Discord.Client();
        this.client.once("ready", () => {
            console.log("Ready!");
        });

        this.client.on("message", (message) => {
            if (!message.content.startsWith(prefix) || message.author.bot)
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            console.log(message.content);
            switch (command) {
                case "ping": {
                    message.channel.send("Pong.");
                    break;
                }
                case "pog": {
                    const wasweisich = this.client.emojis.cache.find(
                        (emoji) => emoji.name === "swagtaube"
                    );
                    message.channel.send(wasweisich.toString());
                    break;
                }
                case "server": {
                    message.channel.send(`Server name: ${message.guild.name}\n
                        Total members: ${message.guild.memberCount}`);
                    break;
                }
                case "kick": {
                    if (!message.mentions.users.size) {
                        message.reply('you need to tag a user in order to kick them!');
                        break;
                    }
                    const taggedUser = message.mentions.users.first();

	                message.channel.send(`You wanted to kick: ${taggedUser.username}`);
                    break;
                }
                case "avatar": {
                    if (!message.mentions.users.size) {
                        message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
                        break;
                    }
                    const avatarList = message.mentions.users.map(user => {
                        return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
                    });
                
                    // send the entire array of strings as a message
                    // by default, discord.js will `.join()` the array with `\n`
                    message.channel.send(avatarList);
                    break;
                }
            }
        });
        this.login();
    }
}
