const Discord = require("discord.js")

module.exports = {
    name: "getclient",

    async execute(client, message, args){
        const name = args.slice(0, 2).join(" ");

        const clientInfo = await client.findClient({ name: name });

        let embed = new Discord.MessageEmbed()
            .setTitle(`${clientInfo.name}`)
            .addField("Job", `${clientInfo.job}`)
            .addField("Address", `${clientInfo.address}`);

        if(clientInfo.notes){
            clientInfo.notes.forEach(note => {
                embed.addField("note", note);
            })
        }

        message.channel.send(embed);
    }
}