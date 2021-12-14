import { Bot } from "./src/bot";
import { token, clientId } from "./credentials.json";

function main(){
    const bot: Bot = new Bot(token, clientId);
}

main();