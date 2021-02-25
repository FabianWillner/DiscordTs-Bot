module.exports = {
    name: "kick",
    description: "Poggers",
    execute(message, args) {
        if (!message.mentions.users.size) {
            message.reply("you need to tag a user in order to kick them!");
            return;
        }
        const taggedUser = message.mentions.users.first();

        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    },
};
