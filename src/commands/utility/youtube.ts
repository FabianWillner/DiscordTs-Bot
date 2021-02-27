import ytdl = require("ytdl-core");
import * as Discord from "discord.js";
import { argumentWrapper } from "../../interfaces/wrapperObject";

module.exports = {
    name: "youtube",
    args: true,
    aliases: ["yt", "play"],
    description: "Plays music from youtube",
    execute(message: Discord.Message, context: argumentWrapper) {
        const { args, youtubePlayer, logger } = context;

        const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
        const guildId: string = message.guild.id;
        if (!voiceChannel) {
            return;
        }

        switch(args[0]){
            case "stop": { 
                youtubePlayer.stop(guildId);
                break; 
             } 
             case "pause": { 
                youtubePlayer.pause(guildId);
                break; 
             } 
             case "skip": { 
                youtubePlayer.skip(guildId);
                break; 
             } 
             case "resume": { 
                youtubePlayer.resume(guildId);
                break; 
             } 
             default: { 
                try {
                    youtubePlayer.add(args[0], voiceChannel);
                } catch (error) {
                    logger.log("error", `${error}`);
                    //console.error();
                    message.reply("there was an error trying to play that song!");
                }
                break; 
             } 
        }
    },
};
