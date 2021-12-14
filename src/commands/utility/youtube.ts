import ytdl = require("ytdl-core");
import * as Discord from "discord.js";
import { argumentWrapper } from "../../interfaces/wrapperObject";
import { logger } from "../../logger/logger";
import { youtubePlayer } from "../../music/youtubePlayer";
import { youtubeApi } from "../../../credentials.json";
import youtubeSearch from "youtube-search";
import { link } from "fs";

var opts: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 1,
    key: youtubeApi,
};

function isYoutubeUrl(url: String) {
    if (url != undefined || url != "") {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            // Do anything for being valid
            return true;
        } else {
            return false;
        }
    }
    return false;
}

module.exports = {
    name: "youtube",
    args: true,
    aliases: ["yt", "play"],
    description: "Plays music from youtube",
    async execute(message: Discord.Message, context: argumentWrapper) {
        const { args } = context;
        if (!message.member?.voice.channel){
            return;
        }
        const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
        const guildId: string | undefined = message.guild?.id;
        if (!guildId || !args) {
            return;
        }
        switch (args[0]) {
            case "stop": {
                youtubePlayer.stop(guildId);
                break;
            }
            case "yamete": {
                youtubePlayer.stop(guildId);
                break;
            }
            case "止めて": {
                youtubePlayer.stop(guildId);
                break;
            }
            case "やめて": {
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
            case "reset": {
                youtubePlayer.reset(voiceChannel);
                break;
            }
            default: {
                try {
                    if (isYoutubeUrl(args[0])) {
                        youtubePlayer.add(args[0], voiceChannel);
                    } else {
                        const searchResult = await youtubeSearch(
                            args.join(" "),
                            opts
                        );
                        youtubePlayer.add(
                            searchResult.results[0].link,
                            voiceChannel
                        );
                    }
                } catch (error) {
                    logger.log("error", `${error}`);
                    //console.error();
                    message.reply(
                        "there was an error trying to play that song!"
                    );
                }
                break;
            }
        }
    },
};
