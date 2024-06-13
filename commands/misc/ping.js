module.exports = {
    name: "ping",
    description: "Pong!",
    //devOnly: boolean,

    callback: (client, interaction) => {
        interaction.reply(`Pong ${client.ws.ping}ms`)
    }
}