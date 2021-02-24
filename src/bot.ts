import * as credentials from '../credentials';

import Discord = require('discord.js');


export class Bot {
    private client: Discord.Client;


    constructor(){
        this.initBot();
    }

    private login() {
        this.client.login(credentials.getApiKey());
    }

    private initBot(){
        this.client = new Discord.Client(); 
        this.client.once('ready', () => {
            console.log('Ready!');
        });
        
        this.client.on('message', message => {
            console.log(message.content);
        });

        this.login();
    }
}


