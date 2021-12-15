import * as Discord from "discord.js";
import fetch from "node-fetch";

export default {
    name: "dad",
    description: "dad joke",
    async execute(message: Discord.Message, args: string[]) {
        const response = await fetch("https://icanhazdadjoke.com/", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const invite = await response.json();
        // @ts-ignore
        message.channel.send(invite.joke);
    },
};
