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
                const locales = {
                    "en-GB": `Only developers are allowed to run this command.`,
                    "ru": "Эту команду могут использовать только разработчики."
                }

                interaction.reply({
                    content: locales[interaction.locale],
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.testOnly){
            if (!(interaction.guild.id === testServer)) {
                const locales = {
                    "en-GB": `This command cannot be run here.`,
                    "ru": "Эту команду нельзя тут использовать."
                }
                
                interaction.reply({
                    content: locales[interaction.locale],
                    ephemeral: true,
                })
                return;
            }
        }


        if (commandObject.permissionsRequired?.length){
            for (const permission of commandObject.permissionsRequired){
                if (!interaction.member.permissions.has(permission)){
                    const locales = {
                        "en-GB": "You don't have enough permissions.",
                        "ru": "У вас недостаточно прав."
                    }
                    interaction.reply({
                        content: locales[interaction.locale],
                        ephemeral: true,
                    })
                    return;
                }
            }
        }
        if (commandObject.botPermissions?.length){
            for (const permission of commandObject.botPermissions){
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)){
                    const locales = {
                        "en-GB": "I don't have enough permissions.",
                        "ru": "У меня недостаточно прав."
                    }
                    interaction.reply({
                        content: locales[interaction.locale],
                        ephemeral: true,
                    })
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction)

    } catch (error) {
        console.error(`There was an error running this command: ${error.stack}.`);
    }
}