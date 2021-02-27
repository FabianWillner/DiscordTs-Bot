import * as Discord from "discord.js";
import ytdl = require("ytdl-core");
import * as Winston from "winston";

export class YoutubePlayer {
    private logger: Winston.Logger;

    constructor(logger: Winston.Logger) {
        this.logger = logger;
    }

    private map = new Map<Discord.VoiceChannel, youtubePlayerInstance>();

    public add(link: string, voiceChannel: Discord.VoiceChannel) {
        if (this.map.has(voiceChannel)) {
            this.map.get(voiceChannel).add(link);
        } else {
            this.map.set(
                voiceChannel,
                new youtubePlayerInstance(voiceChannel, this.logger)
            );
            this.map.get(voiceChannel).add(link);
        }
    }

    public stop(voiceChannel: Discord.VoiceChannel) {
        if (this.map.has(voiceChannel)) {
            this.map.get(voiceChannel).stop();
        }
    }

    public pause(voiceChannel: Discord.VoiceChannel) {
        if (this.map.has(voiceChannel)) {
            this.map.get(voiceChannel).pause();
        }
    }

    public resume(voiceChannel: Discord.VoiceChannel) {
        if (this.map.has(voiceChannel)) {
            this.map.get(voiceChannel).resume();
        }
    }

    public skip(voiceChannel: Discord.VoiceChannel) {
        if (this.map.has(voiceChannel)) {
            this.map.get(voiceChannel).skip();
        }
    }
}

class youtubePlayerInstance {
    private channel: Discord.VoiceChannel;
    private queue: string[] = [];
    private playing: boolean = false;
    private dispatcher: Discord.StreamDispatcher;
    private paused: boolean = false;
    private logger: Winston.Logger;

    constructor(voiceChannel: Discord.VoiceChannel, logger: Winston.Logger) {
        this.channel = voiceChannel;
        this.logger = logger;
    }

    public add(link: string) {
        this.logger.log("info", `Adding song to queue`);
        if (this.queue.push(link) == 1) {
            this.play();
        }
    }

    public pause() {
        if (!this.paused) {
            this.logger.log("info", `Pause song`);
            this.dispatcher.pause();
            this.paused = true;
        }
    }

    public resume() {
        if (this.paused) {
            this.logger.log("info", `Resuming song`);
            this.dispatcher.resume();
            this.paused = false;
        }
    }

    public skip() {
        if (this.playing) {
            this.logger.log("info", `Skipping song`);
            this.playing = false;
            this.dispatcher.end();
            this.play();
        }
    }

    public stop() {
        this.logger.log("info", `Stop playing songs`);
        this.playing = false;
        this.queue = [];
        this.dispatcher.end();
    }

    private play() {
        if (!this.playing && this.queue.length > 0) {
            this.channel.join().then((connection) => {
                this.playing = true;
                try {
                    const link = this.queue.shift();
                    this.logger.log("info", `Start playing: ${link}`);
                    const stream = ytdl(link, {
                        filter: "audioonly",
                    });
                    this.dispatcher = connection.play(stream);
                    this.dispatcher.on("start", () => (this.playing = true));
                    this.dispatcher.on("finish", () => this.songFinished());
                    this.dispatcher.on("close", () => this.songFinished());
                } catch (error) {
                    this.logger.log("error", `${error}`);
                    //console.error();
                }
            });
        }
    }

    private songFinished() {
        this.playing = false;
        if (this.queue.length > 0) {
            this.play();
        } else {
            setTimeout(() => this.shouldDisconnect(), 300000);
        }
    }

    private shouldDisconnect() {
        if (this.queue.length == 0 && !this.playing) {
            this.logger.log("debug", `Disconnected from voice due timeout`);
            this.channel.leave();
        }
    }
}
