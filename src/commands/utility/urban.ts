import * as Discord from "discord.js";
import fetch from "node-fetch";

export default {
    name: "urban",
    description: "urban dictionary search",
    async execute(message: Discord.Message, args: string[]) {
        if (!args?.length) {
            return message.channel.send("You need to supply a search term!");
        }
        const querystring = await import("querystring");
        const query = querystring.stringify({ term: args.join(" ") });
        const response = await fetch(
            `https://api.urbandictionary.com/v0/define?${query}`
        );
        // @ts-ignore
        const { list } = await response.json();

        if (!list.length) {
            return message.channel.send(
                `No results found for **${args.join(" ")}**.`
            );
        }

        message.channel.send(list[0].definition);
    },
};
