const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, Events, GatewayIntentBits,Intents, ApplicationCommandOptionType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.on(Events.ClientReady, c => {
	console.log(`Ready! sss in as ${c.user.tag}`);
	const GuildId = '781272820272463912'
	const guild = client.guilds.cache.get(GuildId);
	let commands
	if (guild) {
		commands = guild.commands;
	} else {
		commands = client.application?.commands;
	}
	commands?.create({
		name: 'ping',
		description: 'Botun ping değerini gösterir.',
	})
	commands?.create({
		name: 'server',
		description: 'Sunucu bilgilerini gösterir.',
	})
	commands?.create({
		name: 'user',
		description: 'Kullanıcı bilgilerini gösterir.',
	})
	commands?.create({
		name: 'adayolustur',
		description: 'Aday olmak için başvuru yapar.',
		options: [
			{
				name: 'isim',
				description: 'İsminizi giriniz.',
				required: true,
				type: 3
			},
			{
				name: 'soyisim',
				description: 'Soyisminizi giriniz.',
				type: 3,
				required: true,
			},
			{
				name: 'yas',
				description: 'Yaşınızı giriniz.',
				type: 4,
				required: true,
			}
		]
	})

});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.login(process.env.TOKEN);