import * as Discord from "discord.js";
import ytdl = require("ytdl-core");
import { youtubePlayerVCInstance } from "./youtubePlayerVCInstantce";
import { logger } from "../logger/logger";

class YoutubePlayer {
    constructor() {}

    private map = new Map<string, youtubePlayerVCInstance>();

    public add(link: string, voiceChannel: Discord.VoiceChannel) {
        const guildId = voiceChannel.guild.id;
        if (!this.map.has(guildId)) {
            logger.log("debug", "Create new youtubePlayerVCInstance");
            this.map.set(guildId, new youtubePlayerVCInstance());
        }
        this.map.get(guildId).add(link, voiceChannel);
    }

    public stop(guildId: string) {
        this.map.get(guildId)?.stop();
    }

    public pause(guildId: string) {
        this.map.get(guildId)?.pause();
    }

    public resume(guildId: string) {
        this.map.get(guildId)?.resume();
    }

    public skip(guildId: string) {
        this.map.get(guildId)?.skip();
    }

    public reset(voiceChannel: Discord.VoiceChannel) {
        const guildId = voiceChannel.guild.id;
        if (this.map.has(guildId)) {
            this.map.get(guildId)?.forceLeaveChanel();
            this.map.delete(guildId);
            this.map.set(guildId, new youtubePlayerVCInstance());
        } 
    }
}

export const youtubePlayer = new YoutubePlayer();
