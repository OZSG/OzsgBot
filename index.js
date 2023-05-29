const { Client, Events, GatewayIntentBits, ApplicationCommandOptionType, Embed, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const {dbtoken} = require('./config.json');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let botbilgi = [];
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const clientt = new MongoClient(dbtoken, {
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
		// BOT BİLGİLERİ ALINIYOR..
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
			client.login(token);
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
	// commands?.create({
	// 	name: 'secimolustur',
	// 	description: 'Secim olusturur.',
	// })
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
		name: 'oyver',
		description: 'Oy verir.',
		options: [
			{
				name: 'aday',
				description: 'Aday Seçiniz',
				type: 8,
				required: true,
			}
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
				type: 8,
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
	commands?.create({
		name: 'secimigoruntule',
		description: 'Secim sonuclarini gösterir.',
	})
	commands?.create({
		name: 'secimolustur',
		description: 'Secim olusturur.',
	})
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isCommand()) return;
	//console.log(interaction);
	const { commandName } = interaction;
	let secmencommand = ["oyver","secimigoruntule"];
	let admincommand = ["veritabanikur", "adayayarla", "adaylistele", "ayarlistele", "secmenolustur", "secimolustur"];
	if (admincommand.includes(commandName)) {
		if (!interaction.member.roles.cache.has(botbilgi[1])) {
			return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsin.', ephemeral: true });
		}
	}else if (secmencommand.includes(commandName)) {
		//KOMUTU KULLANAN SEÇMEN LİSTESİNDE Mİ ?
		const dbNames = "OzsgSecim";
		const collectionNames = "Secmenler";
		const databases = clientt.db(dbNames);
		const collections = databases.collection(collectionNames);
		const query = { name: interaction.user.id };
		const result = await collections.findOne(query);
		if (!result) {
			return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsin.', ephemeral: true });
		}else{
			switch (commandName) {
				case "oyver":
					console.log("secmen oy veriyor..");
			const rolid = interaction.options.getRole('aday').id;
			// adayi arastir oy vermis mi vermemis mi
			const dbNames = "OzsgSecim";
			const collectionNames = "Secmenler";
			const databases = clientt.db(dbNames);
			const collections = databases.collection(collectionNames);
			const query = { name: interaction.user.id };
			const result = await collections.findOne(query);
			if (result) {
				console.log("secmen bulundu");
				// oy no yu kontrol et
				const oy = result.Bilgiler.oy;
				if (oy == 0) {
					console.log("oy verilmemis");
					// rolid Aday listesinde var mi
					const dbNamesx = "OzsgSecim";
					const collectionNamesx = "Adaylar";
					const databasesx = clientt.db(dbNamesx);
					const collectionsx = databasesx.collection(collectionNamesx);
					const query = { no: rolid };
					const result = await collectionsx.findOne(query);
					if (result) {
						console.log("aday bulundu");
						// oy sayısını arttır
						result.Bilgiler.oysayisi = result.Bilgiler.oysayisi + 1;
						const newvalues = { $set: { Bilgiler: result.Bilgiler } };
						collectionsx.updateOne(query, newvalues, function (err, res) {
							if (err) throw err;
							console.log("1 document updated");
						});
					}else{
							console.log("aday bulunamadi");
							return interaction.reply({ content: 'Aday bulunamadı.', ephemeral: true });
						}
					
					// Secmenin verdiği oyu güncelle
					const dbNames2 = "OzsgSecim";
					const collectionNames2 = "Secmenler";
					const databases2 = clientt.db(dbNames2);
					const collections2 = databases2.collection(collectionNames2);
					const query2 = { name: interaction.user.id };
					const result2 = await collections2.findOne(query2);
					if (result2) {
						result2.Bilgiler.oy = rolid;
					const newvalues2 = { $set: { Bilgiler: result2.Bilgiler } };
					collections2.updateOne(query2, newvalues2, function (err, res) {
						if (err) throw err;
						console.log("1 document updated");
					});
					}	
					interaction.reply({ content: 'Oyunuz alındı.', ephemeral: true });				
					// oy verilmemis
				}else{
					console.log("oy verilmis");
					// oy verilmis
					return interaction.reply({ content: 'Zaten oy vermişsin.', ephemeral: true });
				}
			}
					break;
				case "secimigoruntule":
					//TAMAMLANDI
					console.log("secim sonuclari gosteriliyor..");
					const dbxname = "OzsgSecim";
					const dbxcollection = "Adaylar";
					const dbx = clientt.db(dbxname);
					const dbxc = dbx.collection(dbxcollection);
					const queryx = { };
					const resultx = await dbxc.find(queryx).toArray();
					if (resultx) {
						console.log("adaylar bulundu");
						//console.log(resultx);
						let adaylar = "";
						// id to role name in guild id
						//const guildid = client.guilds.cache.get(botbilgi[0]);
						//const guild = client.guilds.cache.get(botbilgi[0]);
						for (let index = 0; index < resultx.length; index++) {
							//const role = guild.roles.cache.get(resultx[index].no);
							//console.log(role.name);
							adaylar = adaylar + resultx[index].Bilgiler.parti + " : " + resultx[index].Bilgiler.oysayisi + "\n";
					}
						console.log(adaylar);
						const embed = new EmbedBuilder()
						.setColor('#0099ff')
						.setTitle('Seçim Sonuçları')
						.setDescription(String(adaylar))
						.setTimestamp();
						//.setFooter('OzsgBot');
						interaction.reply({ embeds: [embed] });
					}else{
						console.log("adaylar bulunamadi");
						return interaction.reply({ content: 'Adaylar bulunamadı.', ephemeral: true });
					}
					break;
			
				default:
					break;
			}
			// TAMAMLANDI
		}
	}

	switch (commandName) {
		case 'secmenolustur':
			// TAMAMLANDI
			const isimid = interaction.options.getUser('isim').id;
			const isim = interaction.options.getUser('isim').username;
			//console.log(isim + ' ' + isimid);
			const dbNames = "OzsgSecim";
			const collectionNames = "Secmenler";
			const databases = clientt.db(dbNames);
			const collections = databases.collection(collectionNames);
			// create array
			const adaybilgi = [
				{
				name: isimid,
				Bilgiler: {
					isim: isim,
					oy: 0,
				}}
			]
			//secmenin varlığını kontrol et
			const queryy = { name: isimid };
			const result = await collections.findOne(queryy);
			if (result) {
				console.log(`A document was found with the _id: ${result._id}`);
				return interaction.reply({ content: 'Bu secmen zaten var.', ephemeral: true });
			}
			try {
				const result = await collections.insertMany(adaybilgi);
				console.log(`A document was inserted with the _id: ${result.insertedId}`);
			} catch (err) {
				console.log(`Failed to insert a document: ${err}`);
			}
			// const guild = client.guilds.cache.get(interaction.guildId);
			// console.log(guild);
			interaction.reply('Secmen olusturuldu.');
			break;
		case 'veritabanikur':
			// TAMAMLANDI
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
			// check server admin permission

			const collectionName2 = "Adaylar";
			const database2 = clientt.db("OzsgSecim");
			const collection2 = database2.collection(collectionName2);
			const Aday = [
				{
					no: interaction.options.getRole('no').id,
					Bilgiler: {
						isim: interaction.options.getUser('isim').id,
						ikincilisim: interaction.options.getUser('ikincilisim').id,
						parti: interaction.options.getString('parti'),
						oysayisi: 0,
					},
				}
			]
			if (await collection2.findOne({ no: interaction.options.getRole('no').id })) {
				const findOneQuery = { no: interaction.options.getRole('no').id };
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


