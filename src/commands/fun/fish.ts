import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";
import { token } from "../../../credentials.json";

module.exports = {
    name: "fish",
    aliases: ["fishington", "fishington.io", "angeln"],
    description: "Fishington.io a game",
    async execute(message: Discord.Message, context: argumentWrapper) {
        if (!message.member?.voice.channel){
            return;
        }
        const voiceChannel = message.member.voice.channel;
        const fetch = require("node-fetch");
        const response = await fetch(
            `https://discord.com/api/v8/channels/${voiceChannel}/invites`,
            {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "814288819477020702", // fish
                    target_type: 2,
                    temporary: false,
                    validate: null,
                }),
                headers: {
                    Authorization: `Bot ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const invite = await response.json();

        if (!invite.code) {
            message.channel.send("Cannot start Fishington.io, please retry");
        } else {
            message.channel.send(
                `Click on the Link to start fishing Together:\n> https://discord.com/invite/${invite.code}`
            );
        }
    },
};
