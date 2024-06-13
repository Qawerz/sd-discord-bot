module.exports = {
    name: "ping",
    description: "Pong!",
    "integration_types": [1],
    "contexts":[0,1,2],
    
    //devOnly: boolean,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`)
    }
}