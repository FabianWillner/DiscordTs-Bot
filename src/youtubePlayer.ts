import * as Discord from "discord.js";
import ytdl = require("ytdl-core");
import * as Winston from "winston";

export class YoutubePlayer {
    private logger: Winston.Logger;

    constructor(logger: Winston.Logger) {
        this.logger = logger;
    }

    private map = new Map<string, youtubePlayerInstance>();

    public add(link: string, voiceChannel: Discord.VoiceChannel) {
        const guildId = voiceChannel.guild.id;
        if (!this.map.has(guildId)) {
            this.map.set(guildId, new youtubePlayerInstance(this.logger));
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
}

class youtubePlayerInstance {
    private connection: Discord.VoiceConnection;
    private queue: string[] = [];
    private playing: boolean = false;
    private paused: boolean = false;
    private logger: Winston.Logger;
    private timer: NodeJS.Timeout;
    private once: boolean;

    constructor(logger: Winston.Logger) {
        this.once = true;
        this.logger = logger;
    }

    public async joinVC(voiceChannel: Discord.VoiceChannel) {
        if (
            !voiceChannel.members.has(
                voiceChannel.guild.members.client.user.id
            ) ||
            this.once
        ) {
            this.connection = await voiceChannel.join();
            this.setTimer();
            this.once = false;
        }
    }

    public async add(link: string, voiceChannel: Discord.VoiceChannel) {
        //this.logger.log("info", `Adding song to queue`);
        if (this.queue.push(link) == 1 && !this.playing) {
            await this.play(voiceChannel);
        }
    }

    public pause() {
        if (!this.paused) {
            //this.logger.log("info", `Pause song`);
            //this.setTimer();
            this.connection.dispatcher.pause();
            this.paused = true;
        }
    }

    public resume() {
        if (this.paused) {
            //this.logger.log("info", `Resuming song`);
            this.connection.dispatcher.resume();
            clearTimeout(this.timer);
            this.paused = false;
        }
    }

    public skip() {
        if (this.playing) {
            //this.logger.log("info", `Skipping song`);
            this.playing = false;
            this.paused = false;
            this.connection.dispatcher.end();
        }
    }

    public stop() {
        //this.logger.log("info", `Stop playing songs`);
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
                //this.logger.log("info", `Start playing: ${link}`);
                const stream = ytdl(link, {
                    filter: "audioonly",
                });
                const dispatcher = this.connection.play(stream);
                dispatcher.on("finish", () => this.songFinished());
                //dispatcher.on("close", () => this.songFinished());
            } catch (error) {
                //this.logger.log("error", `${error}`);
                console.error(error);
                this.playing = false;
            }
        }
    }

    private songFinished() {
        this.playing = false;
        if (this.queue.length > 0) {
            this.play(this.connection.channel);
        } else {
            this.setTimer();
        }
    }

    private leaveChanel(){
        this.connection.channel.leave();
        clearTimeout(this.timer);
    }

    private setTimer(){
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.leaveChanel(), 300000);
    }
}
