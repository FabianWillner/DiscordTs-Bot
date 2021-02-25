module.exports = {
	name: 'ready',
	once: true,
	execute(commands, client) {
		console.log('Ready!');
        client.user.setActivity('YOU!!!', { type: 'WATCHING' });
        //client.user.setStatus('dnd');
	},
};