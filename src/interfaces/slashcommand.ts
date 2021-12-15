import * as Discord from "discord.js";

export interface slashcommand {
    execute(interaction: Discord.Interaction): void;
}
