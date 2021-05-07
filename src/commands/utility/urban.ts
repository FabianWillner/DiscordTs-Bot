import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "urban",
    description: "urban dictionary search",
    async execute(message: Discord.Message, context: argumentWrapper) {
        const { args } = context;
        
        if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}
        const fetch = require('node-fetch');
        const querystring = require('querystring');
		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
			.then(response => response.json());
        if (!list.length) {
            return message.channel.send(`No results found for **${args.join(' ')}**.`);
        }
        
        message.channel.send(list[0].definition);
    },
};