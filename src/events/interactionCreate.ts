import * as Discord from "discord.js";
import { slashcommands } from "../helperStructures/slashcommands.js";
import { logger } from "../logger/logger.js";

export default {
    name: "interactionCreate",
    execute(interaction: Discord.Interaction) {
        if (interaction.isButton()) {
            const command = slashcommands.get(interaction.customId);
            if (!command) return;
            try {
                command.execute(interaction);
            } catch (error) {
                logger.log(
                    "error",
                    `the message ${interaction.customId} has thrown: ${error}`
                );
                interaction.reply(
                    "there was an error trying to execute that command!"
                );
            }
        } else if (interaction.isCommand()) {
            const command = slashcommands.get(interaction.commandName);
            if (!command) return;
            try {
                command.execute(interaction);
            } catch (error) {
                logger.log(
                    "error",
                    `the message ${interaction.command} has thrown: ${error}`
                );
                interaction.reply(
                    "there was an error trying to execute that command!"
                );
            }
        }
    },
};
