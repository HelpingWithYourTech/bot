module.exports = {
    name: "addnote",

    async execute(client, message, args){
        const name = args.slice(0, 2).join(" ");
        const note = args.slice(2).join(" ");

        const clientInfo = await client.findClient({ name: name });

        await clientInfo.notes.push(note);
        await clientInfo.save();

        message.channel.send(`Added the note ${note} to ${name}`);
    }
}