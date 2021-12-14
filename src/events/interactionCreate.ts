import { prefix } from "../../credentials.json";
import * as Discord from "discord.js";
import * as DiscordApi from 'discord-api-types/v9';
import { argumentWrapper } from "../interfaces/wrapperObject";
import { logger } from "../logger/logger";

module.exports = {
    name: "interactionCreate",
    execute(interaction: any, context: argumentWrapper) {
        console.log("Respons?????")
		if (!interaction.isCommand()) return;

	    if (interaction.commandName === 'ping') {
		    interaction.reply('Pong!');
	    }
    },
};
