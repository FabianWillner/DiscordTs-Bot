import * as Discord from "discord.js";
import credentials from "../../../credentials.json";
import fetch from "node-fetch";

export default {
    name: "watchtogether",
    aliases: ["testyoutube", "watch", "watch2gether", "together"],
    description: "Testing youtube",
    async execute(message: Discord.Message, args: string[]) {
        if (!message.member?.voice.channel) {
            return;
        }
        const voiceChannel = message.member.voice.channel;
        const response = await fetch(
            `https://discord.com/api/v8/channels/${voiceChannel}/invites`,
            {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "755600276941176913", // youtube together
                    target_type: 2,
                    temporary: false,
                    validate: null,
                }),
                headers: {
                    Authorization: `Bot ${credentials.token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const invite = await response.json();
        // @ts-ignore
        if (!invite.code) {
            message.channel.send(
                "Cannot start the youtube together, please retry"
            );
        } else {
            message.channel.send(
                // @ts-ignore
                `Click on the Link to start watching YouTube Together:\n> https://discord.com/invite/${invite.code}`
            );
        }
    },
};
