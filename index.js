const { Client, Events, GatewayIntentBits, ApplicationCommandOptionType, Embed, EmbedBuilder } = require('discord.js');
//const { token } = require('./config.json');
//const {dbtoken} = require('./config.json');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let botbilgi = [];
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const clientt = new MongoClient(process.env.MTOKEN, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db= true;

//wait for the mongodb clientt to connect to the server
(async () => {
	try {
		await clientt.connect();
		await clientt.db("OzsgSecim").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
		const collectionName = "Bot";
		const database = clientt.db("OzsgSecim");
		const collection = database.collection(collectionName);
		const query4 = {};
		const options4 = {
			// sort matched documents in descending order by rating
			sort: { name: -1 },
			// Include only the `title` and `imdb` fields in the returned document
			projection: { _id: 0, name: 1, Bilgiler: 1 },
		};
		const cursor4 = await collection.find(query4, options4);
		// print a message if no documents were found
		if (( await collection.estimatedDocumentCount()) === 0) {
			console.log("No documents found!");
		}
		// Bilgiler, No to array
		let AyarAName = [];
		let AyarAValue = [];
		await cursor4.forEach(function (doc) {
			botbilgi.push(doc.Bilgiler.value);
		}).then(() => {
			console.log("Connected successfully to server");
			client.login(process.env.DTOKEN);
		});
		//console.log(botbilgi[0]);
		
		// Devam eden diğer kodlar buraya gelebilir
	} catch (err) {
		console.error(err);
	}
})();
// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	const GuildId = '781272820272463912'
	console.log(botbilgi[1]);
	const guild = client.guilds.cache.get(GuildId);
	let commands
	if (guild) {
		commands = guild.commands;
	} else {
		commands = client.application?.commands;
	}
	commands?.create({
		name: 'secimolustur',
		description: 'Secim olusturur.',
	})
	commands?.create({
		name: 'secmenolustur',
		description: 'Secim Secmenini olusturur.',
		options: [
			{
				name: 'isim',
				description: 'isim tagle giriniz.',
				type: 6,
				required: true,
			},
		]
	})
	commands?.create({
		name: 'veritabanikur',
		description: 'Veritabani kurar.',
		options: [
			{
				name: 'bot',
				description: 'B.',
				type: 7,
				required: true,
			},
			{
				name: 'secimkanali',
				description: 'Secimlerin yapilacaği kanali giriniz.',
				type: 7,
				required: true,
			},
			{
				name: 'secimrolü',
				description: 'Secim rolünü giriniz.',
				type: 8,
				required: true,
			},
			{
				name: 'botyetkili',
				description: 'BotYetkili rolünü giriniz.',
				type: 8,
				required: true,
			},
			{
				name: 'sunucuid',
				description: 'SunucuID giriniz.',
				type: 3,
				required: true,
			},
		]
	})
	commands?.create({
		name: 'adayayarla',
		description: 'Aday ekler.',
		options: [
			{
				name: 'no',
				description: 'Aday numarasini giriniz.',
				type: 4,
				required: true,
			},
			{
				name: 'isim',
				description: 'Aday ismini giriniz.',
				type: 6,
				required: true,
			},
			{
				name: 'ikincilisim',
				description: 'Aday ikincil ismini giriniz. eğer ikincil isim yoksa ayni ismi giriniz.',
				type: 6,
				required: true,
			},
			{
				name: 'parti',
				description: 'Aday partisini giriniz.',
				type: 3,
				required: true,
			},
		]
	})
	commands?.create({
		name: 'adaylistele',
		description: 'Aday listesini gösterir.',
	})
	commands?.create({
		name: 'ayarlistele',
		description: 'Aday listesini gösterir.',
	})
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
	//console.log(interaction);
	const { commandName } = interaction;
	switch (commandName) {
		case 'secmenolustur':
			const isimid = interaction.options.getUser('isim').id;
			const isim = interaction.options.getUser('isim').username;
			console.log(isim + ' ' + isimid);
			// const guild = client.guilds.cache.get(interaction.guildId);
			// console.log(guild);
			interaction.reply('Secmen olusturuldu.');
			break;
		case 'veritabanikur':
			const dbName = "OzsgSecim";
			const collectionName = "Bot";
			const database = clientt.db(dbName);
			const collection = database.collection(collectionName);
			// create array

			let AyarName = ["BotKanalı", "SecimKanalı", "SecimRolü", "BotYetkiliRolü", "SunucuID"];
			let AyarValue = [interaction.options.getChannel('bot').id, interaction.options.getChannel('secimkanali').id, interaction.options.getRole('secimrolü').id, interaction.options.getRole('botyetkili').id, interaction.options.getString('sunucuid')];
			console.log(AyarValue[0]);
			for (let index = 0; index < AyarName.length; index++) {
				const Ayar = [
					{
						name: AyarName[index],
						Bilgiler: {
							value: AyarValue[index]
						},
					}
				]			
				if (await collection.findOne({name : AyarName[index]})) {
					const findOneQuery = { name: AyarName[index] };
					const UpdateDocument = { $set:{Bilgiler: { value: AyarValue[index] }} };
					const updateOptions = { returnOriginal: false };
					await collection.findOneAndUpdate(findOneQuery, UpdateDocument, updateOptions);
				} else {
					try {
						const insertManyResult = await collection.insertMany(Ayar);
						console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
					  } catch (err) {
						console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
					  }
				}
			}
			interaction.reply({ content: 'Veritabanı kuruldu.', ephemeral: true });
			break;
		case 'adayayarla':
			// check server admin perm
			if (!interaction.member.permissions.has('ADMINISTRATOR')) {
				interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsin.', ephemeral: true });
				return;
			}

			const collectionName2 = "Adaylar";
			const database2 = clientt.db("OzsgSecim");
			const collection2 = database2.collection(collectionName2);
			const Aday = [
				{
					no: interaction.options.getInteger('no'),
					Bilgiler: {
						isim: interaction.options.getUser('isim').id,
						ikincilisim: interaction.options.getUser('ikincilisim').id,
						parti: interaction.options.getString('parti')
					},
				}
			]
			if (await collection2.findOne({ no: interaction.options.getInteger('no') })) {
				const findOneQuery = { no: interaction.options.getInteger('no') };
				const UpdateDocument = { $set: { Bilgiler: { isim: interaction.options.getUser('isim').id, ikincilisim: interaction.options.getUser('ikincilisim').id, parti: interaction.options.getString('parti') } } };
				const updateOptions = { returnOriginal: false };
				await collection2.findOneAndUpdate(findOneQuery, UpdateDocument, updateOptions);
			} else {
			try {
					const insertManyResult = await collection2.insertMany(Aday);
					console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
				  } catch (err) {
					console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
				  }
				}
			interaction.reply({ content: 'Aday eklendi.', ephemeral: true });
			break;

		case 'ayarlistele':
			const collectionName4 = "Bot";
			const database4 = clientt.db("OzsgSecim");
			const collection4 = database4.collection(collectionName4);
			const query4 = {};
			const options4 = {
				// sort matched documents in descending order by rating
				sort: { name: -1 },
				// Include only the `title` and `imdb` fields in the returned document
				projection: { _id: 0, name: 1, Bilgiler: 1 },
			};
			const cursor4 = collection4.find(query4, options4);
			// print a message if no documents were found
			if ((await collection4.estimatedDocumentCount()) === 0) {
				console.log("No documents found!");
			}
			// Bilgiler, No to array
			let AyarAName = [];
			let AyarAValue = [];
			await cursor4.forEach(function (doc) {
				AyarAName.push(doc.name);
				AyarAValue.push(doc.Bilgiler);
			});
			const embedayar = new EmbedBuilder()
				.setColor('#0099ff')
				.setTitle('Ayarlar')
				.setDescription('Ayarlar')
				.setTimestamp()
				//.setFooter('OzsgSecim', 'https://i.imgur.com/8zWbZfI.png');
			for (let i = 0; i < AyarAName.length; i++) {
				embedayar.addFields({ name:String(AyarAName[i]), value:String(AyarAValue[i].value), inline: true });
				}
			interaction.reply({ embeds: [embedayar], ephemeral: true });
			break;
		case 'adaylistele':
			const collectionName3 = "Adaylar";
			const database3 = clientt.db("OzsgSecim");
			const collection3 = database3.collection(collectionName3);
			const query = {};
			const options = {
				// sort matched documents in descending order by rating
				sort: { no: -1 },
				// Include only the `title` and `imdb` fields in the returned document
				projection: { _id: 0, no: 1, Bilgiler: 1 },
			};
			const cursor = collection3.find(query, options);
			// print a message if no documents were found
			if ((await collection3.estimatedDocumentCount()) === 0) {
				console.log("No documents found!");
			}
			// Bilgiler, No to array
			let Bilgiler = [];
			let No = [];
			await cursor.forEach(function (doc) {
				Bilgiler.push(doc.Bilgiler);
				No.push(doc.no);
			});
			console.log(Bilgiler[0].isim);
			console.log(No);
			// create embeded message
			const embed = new EmbedBuilder()
				.setColor('#0099ff')
				.setTitle('Adaylar')
				.setDescription('Adaylar listelendi.')
				.setTimestamp();

				for (let i = 0; i < No.length; i++) {
				const guildId = '781272820272463912';
				const guild = client.guilds.cache.get(guildId);
				const member = guild.members.cache.get(Bilgiler[i].isim)
				const displayname = member.displayName;
				embed.addFields({ name:String(No[i]), value:String(displayname), inline: true });
				}
			interaction.reply({
				content: 'Adaylar listelendi.',
				embeds: [embed], 
				ephemeral: true
			});
			break;
	}
});
// Log in to Discord with your client's token
//client.login(token);


