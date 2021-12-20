import { SlashCommandBuilder } from "@discordjs/builders";
import * as Discord from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("Youtube options")
    .addStringOption((option) =>
        option
            .setName("option")
            .setRequired(true)
            .addChoice("Pause", "pause")
            .addChoice("Stop", "stop")
            .addChoice("Skip", "skip")
            .addChoice("Resume", "resume")
    );
