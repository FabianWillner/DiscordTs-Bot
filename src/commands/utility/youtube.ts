import ytdl = require("ytdl-core");
import * as Discord from "discord.js";
import { argumentWrapper } from "../../interfaces/wrapperObject";

module.exports = {
    name: "youtube",
    args: true,
    aliases: ["yt", "play"],
    description: "Plays music from youtube",
    execute(message: Discord.Message, context: argumentWrapper) {
        const { args } = context;
        const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return;
        }

        voiceChannel.join().then((connection) => {
            try {
                const stream = ytdl(args[0], { filter: "audioonly" });
                const dispatcher = connection.play(stream);
                //dispatcher.on("finish", () => voiceChannel.leave());
            } catch (error) {
                console.error();
                message.reply("there was an error trying to play that song!");
            }
        });
    },
};
