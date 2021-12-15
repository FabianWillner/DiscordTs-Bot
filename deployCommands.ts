import * as fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { token, clientId } from "./credentials.json";

const commands = [];
const commandFiles = fs
    .readdirSync("./build/src/slashcommands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./src/slashcommands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    } else {
        console.log("command.data is empty");
    }
}

const rest = new REST({ version: "9" });
if (token !== null) {
    rest.setToken(token);
}

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(clientId, "348083864561909761"),
            //Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
