const { testServer } = require("../../config.json")
const areCommandsDifferent = require("../../utils/areCommandsDifferent")
const getApplicationCommands = require("../../utils/getApplicationCommands")
const getLocalCommands = require("../../utils/getLocalCommands")
const {botData} = require("../../index.js")
const { REST, Routes } = require("discord.js")

module.exports = async (client) => {
	try {
		const localCommands = getLocalCommands()
		// const applicationCommands = await getApplicationCommands(client, testServer)

		let commands = []

		for (const localCommand of localCommands) {
            // console.log(localCommand.data);
			commands.push(localCommand.data)
		}

        // console.log(commands);

        // console.log(botData.clientId);

		const rest = new REST().setToken(botData.token)
		// Refresh commands:
		;(async () => {
			try {
				console.log(`Started refreshing application commands.`)
				
				const data = await rest.put(
					Routes.applicationCommands(botData.clientId),
					{ body: commands }
				)

				console.log(
					`Successfully reloaded ${data.length} application (/) commands.`
				)
			} catch (error) {
				console.error(error)
			}
		})()
	} catch (error) {
		console.error(`There was an error ${error.stack}`)
	}
}
