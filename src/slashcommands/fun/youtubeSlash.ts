import { SlashCommandBuilder } from "@discordjs/builders";
import * as Discord from "discord.js";
import { getOrCreatePlayer } from "../../commands/utility/youtube.js";
import { logger } from "../../logger/logger.js";

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

export const command = {
    async execute(interaction: Discord.CommandInteraction) {
        if (interaction.isButton()) {
            const member = interaction.member;
            if (member instanceof Discord.GuildMember) {
                const vc = member.voice.channel;
                if (!(vc instanceof Discord.VoiceChannel)) {
                    logger.log("info", "User is not in a voice channel.");
                    return;
                }

                const player = getOrCreatePlayer(vc);
                if (!player) {
                    return;
                }
                player.pause();
                await interaction.reply({
                    content: "Pausing the song",
                    ephemeral: true,
                });
            }
        }

        //interaction.reply("Pong!");
    },
};
