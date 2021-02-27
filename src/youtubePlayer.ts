import * as Discord from "discord.js";
import ytdl = require("ytdl-core");

export class YoutubePlayer {
    constructor() {}

    private map = new Map<Discord.VoiceChannel, youtubePlayerInstance>();

    public add(link: string, voiceChannel: Discord.VoiceChannel) {
        if (this.map.has(voiceChannel)) {
            this.map.get(voiceChannel).add(link);
        } else {
            this.map.set(voiceChannel, new youtubePlayerInstance(voiceChannel));
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

    constructor(voiceChannel: Discord.VoiceChannel) {
        this.channel = voiceChannel;
    }

    public add(link: string) {
        if (this.queue.push(link) == 1) {
            this.play();
        }
    }

    public pause() {
        if (!this.paused) {
            this.dispatcher.pause();
            this.paused = true;
        }
    }

    public resume() {
        if (this.paused) {
            this.dispatcher.resume();
            this.paused = false;
        }
    }

    public skip() {
        if (this.playing) {
            this.playing = false;
            this.dispatcher.end();
            this.play();
        }
    }

    public stop() {
        this.playing = false;
        this.queue = [];
        this.dispatcher.end();
    }

    private play() {
        if (!this.playing && this.queue.length > 0) {
            this.channel.join().then((connection) => {
                this.playing = true;
                try {
                    const stream = ytdl(this.queue.shift(), {
                        filter: "audioonly",
                    });
                    this.dispatcher = connection.play(stream);
                    this.dispatcher.on("start", () => (this.playing = true));
                    this.dispatcher.on("finish", () => this.songFinished());
                    this.dispatcher.on("close", () => this.songFinished());
                } catch (error) {
                    console.error();
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
            this.channel.leave();
        }
    }
}
