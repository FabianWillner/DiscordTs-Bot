import { SlashCommandBuilder } from "@discordjs/builders";
import * as Discord from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong");

export const command = {
    execute(interaction: Discord.CommandInteraction) {
        interaction.reply("Pong!");
    },
};
