import * as Discord from "discord.js";
import ytdl = require("ytdl-core");
import { logger } from "../logger/logger";

export class youtubePlayerVCInstance {
    private connection: Discord.VoiceConnection | undefined;
    private queue: string[] = [];
    private playing: boolean = false;
    private paused: boolean = false;
    private timer: NodeJS.Timeout | undefined;
    private once: boolean;

    constructor() {
        this.once = true;
    }

    public async joinVC(voiceChannel: Discord.VoiceChannel) {
        if (
            !voiceChannel.members.has(
                voiceChannel.guild.members.client.user?.id ?? ""
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
            if(!this.connection){
                return this.forceLeaveChanel();
            }
            this.connection.dispatcher.pause();
            this.paused = true;
        }
    }

    public resume() {
        if (this.paused) {
            logger.log("debug", `Resuming song`);
            if(!this.connection){
                return this.forceLeaveChanel();
            }
            this.connection.dispatcher.resume();
            this.clearTimer();
            this.paused = false;
        }
    }

    public skip() {
        if (this.playing) {
            logger.log("info", `Skipping song`);
            this.playing = false;
            this.paused = false;
            if(!this.connection){
                return this.forceLeaveChanel();
            }
            this.connection.dispatcher.end();
            logger.log("debug", `Skipped song`);
        }
    }

    public stop() {
        logger.log("info", `Stopping playing songs`);
        this.playing = false;
        this.queue = [];
        if(!this.connection){
            return this.forceLeaveChanel();
        }
        this.connection.dispatcher.end();
        logger.log("debug", `Stopped playing songs`);
    }

    private async play(voiceChannel: Discord.VoiceChannel) {
        if (!this.playing && this.queue.length > 0) {
            await this.joinVC(voiceChannel);
            if(!this.connection){
                return this.forceLeaveChanel();
            }
            this.playing = true;
            try {
                this.clearTimer();
                const link = this.queue.shift();
                if (!link){
                    throw new RangeError();
                }
                logger.log("debug", `Start playing: ${link}`);
                const stream = ytdl(link, {
                    filter: "audioonly",
                });
                const dispatcher = this.connection.play(stream);
                dispatcher.on("finish", () => this.songFinished());
                //dispatcher.on("close", () => this.songFinished());
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
            if(!this.connection){
                return this.forceLeaveChanel();
            }
            this.play(this.connection.channel);
        } else {
            this.setTimer();
        }
    }

    private leaveChanel() {
        if (!this.playing) {
            logger.log("debug", "Start leaving VC");
            if(!this.connection){
                return this.forceLeaveChanel();
            }
            this.connection.channel.leave();
            this.clearTimer();
            logger.log("debug", "Ending leaving VC");
        }
    }

    private clearTimer() {
        if (this.timer){
            clearTimeout(this.timer);
        }
    }

    private setTimer() {
        this.clearTimer();
        this.timer = setTimeout(() => this.leaveChanel(), 300000);
    }

    public forceLeaveChanel() {
        logger.log("debug", "Starting force leave VC");
        this.stop();
        this.connection?.channel.leave();
        this.clearTimer();
        this.resetAllStates();
        logger.log("debug", "Ending force leave VC");
    }

    private resetAllStates(){
        this.connection = undefined;
        this.queue = [];
        this.playing = false;
        this.paused = false;
        this.timer = undefined;
        this.once = true;
    }
}
