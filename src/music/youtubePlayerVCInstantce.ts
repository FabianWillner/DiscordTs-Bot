import * as Discord from "discord.js";
import ytdl = require("ytdl-core");
import { logger } from "../logger/logger";

export class youtubePlayerVCInstance {
    private connection: Discord.VoiceConnection;
    private queue: string[] = [];
    private playing: boolean = false;
    private paused: boolean = false;
    private timer: NodeJS.Timeout;
    private once: boolean;

    constructor() {
        this.once = true;
    }

    public async joinVC(voiceChannel: Discord.VoiceChannel) {
        if (
            !voiceChannel.members.has(
                voiceChannel.guild.members.client.user.id
            ) ||
            this.once
        ) {
            logger.log("debug", "Join VC");
            this.connection = await voiceChannel.join();
            this.setTimer();
            this.once = false;
        }
    }

    public async add(link: string, voiceChannel: Discord.VoiceChannel) {
        logger.log("debug", `Adding song to queue`);
        if (this.queue.push(link) == 1 && !this.playing) {
            await this.play(voiceChannel);
        }
    }

    public pause() {
        if (!this.paused) {
            logger.log("debug", `Pause song`);
            //this.setTimer();
            this.connection.dispatcher.pause();
            this.paused = true;
        }
    }

    public resume() {
        if (this.paused) {
            logger.log("debug", `Resuming song`);
            this.connection.dispatcher.resume();
            clearTimeout(this.timer);
            this.paused = false;
        }
    }

    public skip() {
        if (this.playing) {
            logger.log("debug", `Skipping song`);
            this.playing = false;
            this.paused = false;
            this.connection.dispatcher.end();
        }
    }

    public stop() {
        logger.log("info", `Stop playing songs`);
        this.playing = false;
        this.queue = [];
        this.connection.dispatcher.end();
    }

    private async play(voiceChannel: Discord.VoiceChannel) {
        if (!this.playing && this.queue.length > 0) {
            await this.joinVC(voiceChannel);
            this.playing = true;
            try {
                clearTimeout(this.timer);
                const link = this.queue.shift();
                logger.log("debug", `Start playing: ${link}`);
                const stream = ytdl(link, {
                    filter: "audioonly",
                });
                const dispatcher = this.connection.play(stream);
                dispatcher.on("finish", () => this.songFinished());
                dispatcher.on("close", () => this.songFinished());
            } catch (error) {
                logger.log("error", `${error}`);
                console.error(error);
                this.playing = false;
            }
        }
    }

    private songFinished() {
        this.playing = false;
        logger.log("debug", "Song finished");
        if (this.queue.length > 0) {
            this.play(this.connection.channel);
        } else {
            this.setTimer();
        }
    }

    private leaveChanel() {
        logger.log("debug", "Leave VC");
        if (!this.playing){
            this.connection.channel.leave();
            clearTimeout(this.timer);
        }
    }

    private setTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.leaveChanel(), 300000);
    }
}
