import * as Discord from "discord.js";
import { getOrCreatePlayer } from "../../commands/utility/youtube.js";
import { logger } from "../../logger/logger.js";

export const command = {
    async execute(interaction: Discord.CommandInteraction) {
        if (interaction.isButton()) {
            const member = interaction.member;
            if (member instanceof Discord.GuildMember) {
                const vc = member.voice.channel;
                if (!(vc instanceof Discord.VoiceChannel)) {
                    logger.log("debug", "User is not in a voice channel.");
                    await interaction.reply({
                        content: "You are not in a voice channel.",
                        ephemeral: true,
                    });
                    return;
                }

                const player = getOrCreatePlayer(vc);
                if (!player) {
                    return;
                }
                player.pause();
                await interaction.reply({
                    content: "Pausing the song.",
                    ephemeral: true,
                });
            }
        }
    },
};
