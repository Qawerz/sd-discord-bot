const {ApplicationCommandOptionType, PermissionFlagsBits,} = require("discord.js")

module.exports = {
	data:{
		name: "ban",
		description: "Bans a member!!!",
		integration_types: [0,1],
        contexts:[0,1,2],
		// devOnly: Boolean,
		// testOnly: Boolean,
		options: [
			{
				name: "target-user",
				description: "The user to ban.",
				required: true,
				type: ApplicationCommandOptionType.Mentionable,
			},
			{
				name: "reason",
				description: "The reason for banning.",
				type: ApplicationCommandOptionType.String,
			},
		],
		},
		permissionsRequired: [PermissionFlagsBits.Administrator],
		botPermissions: [PermissionFlagsBits.Administrator],

	callback: (client, interaction) => {
		interaction.reply("ban..")
	},
}
