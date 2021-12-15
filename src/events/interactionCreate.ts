import { prefix } from "../../credentials.json";
import * as Discord from "discord.js";
import * as DiscordApi from "discord-api-types/v9";
import { argumentWrapper } from "../interfaces/wrapperObject";
import { logger } from "../logger/logger";

module.exports = {
    name: "interactionCreate",
    execute(interaction: Discord.Interaction, context: argumentWrapper) {
        console.log("Respons?????");
        if (!interaction.isButton()) return;

        if (interaction.customId === "ping") {
            interaction.reply("Pong!");
        }
    },
};
