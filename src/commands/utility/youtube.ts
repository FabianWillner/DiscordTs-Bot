import ytdl = require("ytdl-core");
import * as Discord from "discord.js";
import { argumentWrapper } from "../../interfaces/wrapperObject";

module.exports = {
    name: "youtube",
    args: true,
    aliases: ["yt", "play"],
    description: "Plays music from youtube",
    execute(message: Discord.Message, context: argumentWrapper) {
        const { args, youtubePlayer } = context;
        const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return;
        }

        if (args[0] === "stop"){
            youtubePlayer.stop(voiceChannel);
        }else {
            try {
                youtubePlayer.add(args[0], voiceChannel);
            } catch (error) {
                console.error();
                message.reply("there was an error trying to play that song!");
            }
        }
    },
};
