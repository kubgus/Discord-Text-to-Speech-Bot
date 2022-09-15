const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
require('dotenv').config()
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    presence: {
        status: 'online',
        afk: false,
        activities: [{
            name: "t.<lang> <text>",
            type: ActivityType.Listening,
        }],
    },
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
    var m = message.content.toLowerCase();
    var mArray = m.split(" ");

    // [t, sk] // EXAMPLE
    var mSettings = mArray[0].split(".");
    if (mSettings[0] != "t") return;

    // Check if array is valid
    if (mArray.length < 2 || mSettings[1].length != 2) {
        message.reply("Invalid arguments.");
        return;
    }

    mArray.shift();
    say = mArray.join(" ");
    lan = mSettings[1]

    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
    const voice = message.member.voice.channel;

    try {

        const player = createAudioPlayer();

        player.play(createAudioResource(`https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${encodeURI(say)}&tl=${encodeURI(lan)}&client=tw-ob`));
        const connection = joinVoiceChannel({
            channelId: voice.id,
            guildId: message.member.guild.id,
            adapterCreator: voice.guild.voiceAdapterCreator,
        })

        const subscription = connection.subscribe(player)
        if (subscription) {
            setTimeout(() => subscription.unsubscribe(), 15000)
        }

    } catch (e) {
        message.reply("You need to be in a voice channel.");
        return
    }
});

client.login(process.env.TOKEN);