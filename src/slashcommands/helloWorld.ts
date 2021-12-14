const { SlashCommandBuilder } = require('@discordjs/builders');

export const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption((option: { setName: (arg0: string) => { (): any; new(): any; setDescription: { (arg0: string): { (): any; new(): any; setRequired: { (arg0: boolean): any; new(): any; }; }; new(): any; }; }; }) =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));

