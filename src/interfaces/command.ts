import { argumentWrapper } from "./wrapperObject";
import * as Discord from "discord.js";

export interface command {
    execute(message: Discord.Message, context: argumentWrapper): void;
    name: string,
	description?: string,
    args?: boolean,
    aliases?: string[],
    usage?: string
}