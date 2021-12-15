import { Bot } from "./src/bot";
import { token } from "./credentials.json";

function main() {
    const bot: Bot = new Bot(token);
}

main();
