const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
// Read enviroment variables (used for Discord tokens)
require('dotenv').config()
const client = new Client({
    // Bot intents (important)
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    // Set presence status
    presence: {
        status: 'online',
        afk: false,
        activities: [{
            name: "t.<lang> <text>",
            type: ActivityType.Playing,
        }],
    },
});

// Debug ready message
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Runs on any message
client.on("messageCreate", async (message) => {
    var m = message.content.toLowerCase();
    var mArray = m.split(" ");

    // [t, en] // EXAMPLE
    var mSettings = mArray[0].split(".");
    if (mSettings[0] != "t") return;

    // Check if array is valid
    if (mArray.length < 2 || mSettings[1].length != 2) {
        message.reply("Invalid arguments.");
        return;
    }

    // Create the actual variables for the URL
    mArray.shift();
    say = mArray.join(" ");
    lan = mSettings[1]

    // Join the user's voice channel
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
    const voice = message.member.voice.channel;

    // This code can produce errors (mainly when player isn't in vc)
    try {

        // Just some discord.js stuff
        const player = createAudioPlayer();

        // Request the actual sound from Google Translate and play it
        player.play(createAudioResource(`https://translate.google.com.vn/translate_tts?ie=UTF-8&q=${encodeURI(say)}&tl=${encodeURI(lan)}&client=tw-ob`));
        // Join vc
        const connection = joinVoiceChannel({
            channelId: voice.id,
            guildId: message.member.guild.id,
            adapterCreator: voice.guild.voiceAdapterCreator,
        })

        // Stop if the bot has been active for more than a minute to prevent spamming
        const subscription = connection.subscribe(player)
        if (subscription) {
            setTimeout(() => subscription.unsubscribe(), 60000)
        }

    } catch (e) {
        // Error catching
        message.reply("You need to be in a voice channel.");
        return
    }
});

// Create a .env file
// TOKEN=<your token>
// (without string quotes)
// This is here to protect you bot token
client.login(process.env.TOKEN);