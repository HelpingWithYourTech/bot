module.exports = {
    name: "addclient",

    async execute(client, message, args){
        const name = args.slice(0, 2).join(" ");
        const job = args.slice(2, 4).join(" ");
        const address = args.slice(4).join(" ");

        await client.createClient({ name: name, address: address, job: job});
        message.channel.send(`Added ${name} to the database`);
    }
}