const Discord = require('discord.js')

module.exports = {
    name: "clients",

    async execute(client, message, args){
        const clientsData = await client.clientsData.find();
        let embed = new Discord.MessageEmbed();
        clientsData.map(c => {
            return embed.addField(`Name`, `${c.name}\n**Job**\n${c.job}\n**Address**\n${c.address}\n${c.notes ? `**Notes**\n${c.notes}` : "None"}`);
        });


        message.channel.send(embed)
    }
}