import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "dog",
    description: "random dog image",
    async execute(message: Discord.Message, context: argumentWrapper) {
        const fetch = require('node-fetch');
        const file = await fetch('https://dog.ceo/api/breeds/image/random');
        const response = await file.json();
		message.channel.send(response.message);
    },
};

