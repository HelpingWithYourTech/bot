const { Client, Collection } = require("discord.js");

module.exports = class Bot extends Client {
    constructor(options){
        super(options);
        this.config = require("../config");
        this.commands = new Collection();
        this.clientsData = require("./Client");
    }

    async findClient({name: name}){
        let clientData = await this.clientsData.findOne({ name: name})
        return clientData;
    };

    async createClient({name: name, address: address, job: job}){
        let clientData = new this.clientsData({ name: name, address: address, job: job});
        await clientData.save();
    };
}