import ytdl = require("ytdl-core");
import * as Discord from "discord.js";

module.exports = {
    name: "youtube",
    args: true,
    aliases: ["yt", "play"],
    description: "Plays music from youtube",
    execute(message: Discord.Message, args) {
        const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return;
        }

        voiceChannel.join().then((connection) => {
            let stream;
            try {
                stream = ytdl(args[0], { filter: "audioonly" });
            } catch (error) {
                console.error();
                message.reply("there was an error trying to play that song!");
            }

            const dispatcher = connection.play(stream);
            //dispatcher.on("finish", () => voiceChannel.leave());
        });
    },
};
