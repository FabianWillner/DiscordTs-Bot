import * as Discord from "discord.js";
import { command } from "./../interfaces/command";

export const commands: Discord.Collection<string, command> = new Discord.Collection();
