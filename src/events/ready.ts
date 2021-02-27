import { argumentWrapper } from "../interfaces/wrapperObject";

module.exports = {
    name: "ready",
    once: true,
    execute(context: argumentWrapper) {
        const { client } = context;
        console.log("Ready!");
        client.user.setActivity("YOU!!!", { type: "WATCHING" });
        //client.user.setStatus('dnd');
        //client.user.setStatus('invisible');
    },
};
