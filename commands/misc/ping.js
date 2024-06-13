module.exports = {
    data:{
        name: "ping",
        description: "Pong!",
        integration_types: [0,1],
        contexts:[0,1,2],
    },
    devOnly:true,
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`)
    }
}