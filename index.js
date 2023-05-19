const { Client, Collection, Events, GatewayIntentBits,Intents, ApplicationCommandOptionType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.login(process.env.TOKEN);