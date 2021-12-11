import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "dad",
    description: "dad joke",
    async execute(message: Discord.Message, context: argumentWrapper) {
        const fetch = require("node-fetch");
        const response = await fetch("https://icanhazdadjoke.com/", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const invite = await response.json();
        message.channel.send(invite.joke);
    },
};
