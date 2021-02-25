module.exports = {
    name: "server",
    description: "Displays some information about the server",
    execute(message, args) {
        message.channel.send(`Server name: ${message.guild.name}\n
                        Total members: ${message.guild.memberCount}`);
    },
};
