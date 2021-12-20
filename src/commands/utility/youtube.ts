import youtubeSearch from "youtube-search";
import * as Discord from "discord.js";
import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnectionStatus,
    getVoiceConnection,
    VoiceConnection,
    entersState,
} from "@discordjs/voice";
import credentials from "../../../credentials.json";
import ytdl from "ytdl-core";
import { logger } from "../../logger/logger.js";
import internal from "stream";
import { MessageActionRow } from "discord.js";

var opts: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 1,
    key: credentials.youtubeApi,
};

const youtubePlayerCollection: Discord.Collection<string, youtubePlayer> =
    new Discord.Collection();

class youtubePlayer {
    private readonly vc: Discord.VoiceChannel;
    private currentlyPlaying = "Nothing";
    readonly queue: string[] = [];
    private lastMessage:
        | Discord.Message
        | Discord.ButtonInteraction
        | undefined = undefined;
    private readonly player: AudioPlayer;
    public onConnectionDisconnect?: () => void;

    constructor(vc: Discord.VoiceChannel) {
        this.vc = vc;

        const connection = this.getConnection();
        this.player = createAudioPlayer();
        connection.subscribe(this.player);

        // Add listeners
        connection.on(VoiceConnectionStatus.Ready, this.onConnectionReady);
        connection.on(
            VoiceConnectionStatus.Disconnected,
            async (oldState, newState) => {
                if (connection) {
                    try {
                        await Promise.race([
                            entersState(
                                connection,
                                VoiceConnectionStatus.Signalling,
                                5_000
                            ),
                            entersState(
                                connection,
                                VoiceConnectionStatus.Connecting,
                                5_000
                            ),
                        ]);
                        // Seems to be reconnecting to a new channel - ignore disconnect
                    } catch (error) {
                        // Seems to be a real disconnect which SHOULDN'T be recovered from
                        connection.destroy();
                        this.player.stop();
                        if (!this.onConnectionDisconnect) return;
                        this.onConnectionDisconnect();
                    }
                }
            }
        );
        this.player.on(AudioPlayerStatus.Idle, this.onPlayerIdle.bind(this));

        this.player.on("error", (error: any) => {
            logger.log(
                "error",
                `Error: ${error.message} with resource ${error?.resource?.metadata?.title}`
            );
            this.player.stop();
        });
    }

    private getConnection(): VoiceConnection {
        let connection = getVoiceConnection(this.vc.guildId);

        if (!connection) {
            // Connect to the voice channel
            connection = joinVoiceChannel({
                channelId: this.vc.id,
                guildId: this.vc.guildId,
                adapterCreator: this.vc.guild.voiceAdapterCreator,
            });

            if (!connection) {
                logger.log(
                    "info",
                    "Couldn't acquire a connection to the voice channel"
                );
                throw "Couldn't acquire a connection to the voice channel";
            }
        }

        return connection;
    }

    private onConnectionReady() {
        logger.log("info", "Player is ready");
    }

    private onPlayerIdle() {
        this.playNextSong();
        if (this.lastMessage) {
            this.reply(this.lastMessage);
        }
    }

    async youtubeSearch(text: string) {
        const searchResult = await youtubeSearch(text, opts);
        this.addToQueue(searchResult.results[0].link);
    }

    addToQueue(link: string) {
        this.queue.push(link);
        this.start();
    }

    private getStream(): internal.Readable | undefined {
        const link = this.queue.shift();
        if (!link) {
            this.currentlyPlaying = "Nothing";
            return;
        }
        logger.log("info", `Playing song: ${link}`);
        this.currentlyPlaying = link;
        return ytdl(link, {
            filter: "audioonly",
            highWaterMark: 1048576 / 4,
        });
    }

    private playNextSong() {
        const stream = this.getStream();
        if (!stream) return;
        this.player.play(createAudioResource(stream));
    }

    // TODO: Better name?
    start() {
        switch (this.player.state.status) {
            case AudioPlayerStatus.Idle: {
                this.playNextSong();
                break;
            }
            case AudioPlayerStatus.Paused: {
                this.skip();
                break;
            }
            case AudioPlayerStatus.Playing: {
                // Do nothing
                break;
            }
        }
    }

    skip() {
        this.playNextSong();
    }

    pause() {
        this.player.pause();
    }

    unpause() {
        this.player.unpause();
    }

    stop() {
        this.queue.splice(0);
        this.player.stop();
    }

    async reply(
        message: Discord.Message | Discord.ButtonInteraction
    ): Promise<void> {
        const row = new MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("youtubeStop")
                .setStyle("DANGER")
                .setEmoji("⏹"),
            new Discord.MessageButton()
                .setCustomId("youtubePause")
                .setStyle("PRIMARY")
                .setEmoji("⏸"),
            new Discord.MessageButton()
                .setCustomId("youtubePlay")
                .setStyle("PRIMARY")
                .setEmoji("▶️"),
            new Discord.MessageButton()
                .setCustomId("youtubeSkip")
                .setStyle("SUCCESS")
                .setEmoji("⏭")
        );

        if (message instanceof Discord.Message) {
            const nmessage = await message.reply({
                content: `Currently playing: ${this.currentlyPlaying}`,
                components: [row],
            });
            this.deleteMessage();
            this.lastMessage = nmessage;
        } else if (message instanceof Discord.ButtonInteraction) {
            await message.reply({
                content: `Currently playing: ${this.currentlyPlaying}`,
                components: [row],
            });
            this.deleteMessage();
            this.lastMessage = message;
        }
    }

    async deleteMessage() {
        if (this.lastMessage) {
            if (this.lastMessage instanceof Discord.Message) {
                await this.lastMessage.delete();
            } else if (this.lastMessage instanceof Discord.ButtonInteraction) {
                await this.lastMessage.deleteReply();
            }
        }
    }

    // TODO: remove
    fillQueue() {
        this.queue.push(
            "https://www.youtube.com/watch?v=mJS8xrafNdI",
            "https://www.youtube.com/watch?v=H4xE0u4OQcY",
            "https://www.youtube.com/watch?v=mJS8xrafNdI"
        );
        this.start();
    }
}

export function getOrCreatePlayer(vc: Discord.VoiceChannel): youtubePlayer {
    let player = youtubePlayerCollection.get(vc.guildId);

    if (!player) {
        player = new youtubePlayer(vc);
        player.onConnectionDisconnect = () => {
            logger.log("info", "player is disconnected. Trying to kill player");
            youtubePlayerCollection.delete(vc.guildId);
            player = undefined;
        };
        youtubePlayerCollection.set(vc.guildId, player);
    }

    return player;
}

export default {
    name: "youtube",
    args: true,
    aliases: ["yt", "play"],
    description: "Plays music from youtube",
    buttons() {},
    async execute(message: Discord.Message, args: string[]) {
        // Check if the user is in a voice channel
        const vc = message.member?.voice.channel;
        if (!(vc instanceof Discord.VoiceChannel)) {
            logger.log("info", "User is not in a voice channel.");
            return;
        }

        // Check if there were any arguments provided
        if (!args) {
            logger.log("info", "User did not provide arguments.");
            return;
        }

        // Check if there is only one argument
        if (args.length === 1) {
            switch (args[0]) {
                case "q": {
                    const player = youtubePlayerCollection.get(vc.guildId);

                    if (!player) {
                        return;
                    }

                    message.reply({
                        content: player.queue.join(" ") || "Empty",
                    });
                    player.reply(message);
                    break;
                }
                case "fill": {
                    const player = getOrCreatePlayer(vc);

                    player.fillQueue();
                    break;
                }
                case "pause": {
                    const player = youtubePlayerCollection.get(vc.guildId);

                    if (!player) {
                        return;
                    }

                    player.pause();
                    player.reply(message);
                    break;
                }
                case "resume": {
                    const player = youtubePlayerCollection.get(vc.guildId);

                    if (!player) {
                        return;
                    }

                    player.unpause();
                    player.reply(message);
                    break;
                }
                case "skip": {
                    const player = youtubePlayerCollection.get(vc.guildId);

                    if (!player) {
                        return;
                    }

                    player.skip();
                    player.reply(message);
                    break;
                }
                case "stop": {
                    const player = youtubePlayerCollection.get(vc.guildId);

                    if (!player) {
                        return;
                    }

                    player.stop();
                    player.reply(message);
                    break;
                }

                default: {
                    const player = getOrCreatePlayer(vc);

                    if (ytdl.validateURL(args[0])) {
                        player.addToQueue(args[0]);
                    } else {
                        await player.youtubeSearch(args.join(" "));
                    }
                    player.reply(message);
                }
            }
        } else {
            const player = getOrCreatePlayer(vc);

            await player.youtubeSearch(args.join(" "));
            player.reply(message);
        }
    },
};
