import * as Discord from "discord.js";

export interface command {
    execute(message: Discord.Message, args: string[]): void;
    name: string;
    description?: string;
    args?: boolean;
    aliases?: string[];
    usage?: string;
}
