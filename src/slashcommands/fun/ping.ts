import { SlashCommandBuilder } from "@discordjs/builders";
import * as Discord from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong");

export const command = {
    async execute(interaction: Discord.CommandInteraction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};
