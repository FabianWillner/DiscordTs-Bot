module.exports = {
	name: 'pog',
	description: 'Poggers',
	execute(message, args) {
		const wasweisich = message.client.emojis.cache.find(
            (emoji) => emoji.name === "swagtaube"
        );
        message.channel.send(wasweisich.toString());
	},
};