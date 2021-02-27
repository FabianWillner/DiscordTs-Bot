import * as Discord from "discord.js";
import * as Winston from "winston";
import { YoutubePlayer } from "../youtubePlayer";
import { command } from "./command";

export interface argumentWrapper {
    commands: Discord.Collection<string, command>;
    client: Discord.Client;
    youtubePlayer: YoutubePlayer;
    args?: string[];
    logger: Winston.Logger;
}
