import * as Discord from "discord.js";

export default {
    name: "ping",
    description: "Ping!",
    execute(message: Discord.Message, args: string[]) {
        message.channel.send("Pong.");
    },
};
