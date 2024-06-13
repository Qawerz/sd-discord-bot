const {devs, testServer} = require("../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand) return;

    const localCommand = getLocalCommands();

    try {
        const commandObject = localCommand.find((cmd)=> cmd.data.name === interaction.commandName)

        if (!commandObject) return;

        if (commandObject.devOnly){
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: `Only developers are allowed to run this command.`,
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.testOnly){
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: `This command cannot be run here.`,
                    ephemeral: true,
                })
                return;
            }
        }

        if (commandObject.botPermissions?.length){
            for (const permission of commandObject.botPermissions){
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)){
                    interaction.reply({
                        content: `I don't have enough permissions.`,
                        ephemeral: true,
                    })
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction)

    } catch (error) {
        console.error(`There was an error running this command: ${error}.`);
    }
}