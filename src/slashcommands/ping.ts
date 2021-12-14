const { SlashCommandBuilder } = require('@discordjs/builders');

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong');

