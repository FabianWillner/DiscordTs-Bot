import { Bot } from "./src/bot.js";
import credentials from "./credentials.json";

function main() {
    const bot: Bot = new Bot(credentials.token);
}

main();
