import { argumentWrapper } from "../../interfaces/wrapperObject";
import * as Discord from "discord.js";
import { token } from "../../../credentials.json";

module.exports = {
    name: "betrayal",
    aliases: ["amogus", "betrayal.io", "amongus"],
    description: "Play poker",
    async execute(message: Discord.Message, context: argumentWrapper) {
        const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return;
        }
        const fetch = require('node-fetch');
        const response = await fetch(`https://discord.com/api/v8/channels/${voiceChannel}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "773336526917861400", // Betrayal.io
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            }
        })
        const invite = await response.json()

        if (!invite.code) {
            message.channel.send("Cannot start Betrayal.io , please retry")
        } else {
            message.channel.send(`Click on the Link to start playing Betrayal.io Together:\n> https://discord.com/invite/${invite.code}`);
        }
    },
};