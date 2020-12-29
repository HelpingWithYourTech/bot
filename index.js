const Bot = require("./base/Bot"),
    { readdirSync } = require("fs"),
    { join } = require("path"),
    mongoose = require("mongoose");

const client = new Bot({ disableMentions: "everyone" });
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.login(client.config.token);

client.on("ready", () => {
    console.log(`${client.user.username} ready`);
    mongoose.connect(client.config.mongoDBuri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("connected to the db");
    }).catch(e => console.error(e));
});

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for(const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}

client.on("message", (message) => {
    if(!client.config.users.includes(message.author.id)) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.config.prefix)})\\s*`)
    if(!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if(!command) return;

    try {
        command.execute(client, message, args);
    } catch (e) {
        console.error(e);
    }
});
