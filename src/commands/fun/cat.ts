import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";

module.exports = {
    name: "cat",
    description: "random Cat Image",
    async execute(message: Discord.Message, context: argumentWrapper) {
        const fetch = require("node-fetch");
        const { file } = await fetch(
            "https://aws.random.cat/meow"
        ).json();
        message.channel.send(file);
    },
};
