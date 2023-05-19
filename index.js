const { Client, Collection, Events, GatewayIntentBits,Intents, ApplicationCommandOptionType } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences
    ]
});

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.login(process.env.TOKEN);