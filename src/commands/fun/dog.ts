import * as Discord from "discord.js";
import fetch from "node-fetch";

export default {
    name: "dog",
    description: "random dog image",
    async execute(message: Discord.Message, args: string[]) {
        const file = await fetch("https://dog.ceo/api/breeds/image/random");
        const response = await file.json();
        // @ts-ignore
        message.channel.send(response.message);
    },
};
