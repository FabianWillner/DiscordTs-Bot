import * as Discord from "discord.js";
import fetch from "node-fetch";

export default {
    name: "cat",
    description: "random Cat Image",
    async execute(message: Discord.Message, args: string[]) {
        const response = await fetch("https://aws.random.cat/meow");
        // @ts-ignore
        const { file } = await response.json();
        message.channel.send(file);
    },
};
