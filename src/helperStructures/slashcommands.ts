import * as Discord from "discord.js";
import { slashcommand } from "./../interfaces/slashcommand";

export const slashcommands: Discord.Collection<string, slashcommand> = new Discord.Collection();
