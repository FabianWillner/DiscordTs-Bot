import * as Discord from "discord.js";
import { command } from "./command";

export interface argumentWrapper {
    commands: Discord.Collection<string,command>,
    client: Discord.Client,
    args?: string[]
}