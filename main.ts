import { Bot } from "./src/bot.js";
import { token } from "./credentials.json";

function main() {
    const bot: Bot = new Bot(token);
}

main();
