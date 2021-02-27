import * as Discord from "discord.js";
import { YoutubePlayer } from "../youtubePlayer";
import { command } from "./command";

export interface argumentWrapper {
    commands: Discord.Collection<string,command>,
    client: Discord.Client,
    youtubePlayer: YoutubePlayer,
    args?: string[]
}