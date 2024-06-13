const { AttachmentBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data:{
        name: "draw",
        description: "generate a picture with stable diffusion",
        options: [
			{
				name: "prompt",
				description: "Prompt",
				required: true,
				type: ApplicationCommandOptionType.String,
			},
			{
				name: "negative-prompt",
				description: "Negative prompt",
				required: false,
				type: ApplicationCommandOptionType.String,
			},
            {
				name: "seed",
				description: "Seed of image",
				required: false,
				type: ApplicationCommandOptionType.Integer,
			},
            {
				name: "width",
				description: "Width of image",
				required: false,
				type: ApplicationCommandOptionType.Integer,
			},
            {
				name: "height",
				description: "Height of image",
				required: false,
				type: ApplicationCommandOptionType.Integer,
			},
            {
				name: "steps",
				description: "steps of image",
				required: false,
				type: ApplicationCommandOptionType.Integer,
			},
        ],
        integration_types: [0,1],
        contexts:[0,1,2],
    },
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const prompt_string = interaction.options.get('prompt').value;
        const nprompt_string = interaction.options.getString('negative-prompt') ?? "";
        const seed_string = interaction.options.getInteger('seed') ?? -1;
        const width_string = interaction.options.getInteger('width') ?? 512;
        const height_string = interaction.options.getInteger('height') ?? 512;
        const steps_string = interaction.options.getInteger('steps') ?? 15;

        if (steps_string > 30){
            steps_string = 30
        }

        if (width_string > 832) {
            width_string = 832
        }
        if (height_string > 832) {
            height_string = 832
        }

        const payload = {
            "prompt": prompt_string,
            "negative_prompt": nprompt_string,
            "steps": steps_string,
            "seed": seed_string,
            "width": width_string,
            "height": height_string,
            "clip_skip" : 2,
        }

        const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        })

        let result = await response.json()
        let resInfo = JSON.parse(result.info);

        const buffer = Buffer.from(result.images[0], 'base64')
        const attachment = new AttachmentBuilder(buffer, {name: 'image.png'})

        const embed = new EmbedBuilder()
        embed.setColor(0xfbf6ef)
        embed.setImage("attachment://image.png")
        embed.addFields({ name: '__Prompt__', value:  resInfo.prompt })
        if (resInfo.negative_prompt != ""){
            embed.addFields({ name: '__Negative prompt__', value:  resInfo.negative_prompt })
        }
        // .addFields({ name: '\u200B', value: '\u200B' })
        embed.addFields({ name: '__Seed__', value: `${resInfo.seed}`, inline: true })
        embed.addFields({ name: '__Width__', value: `${resInfo.width}`, inline: true })
        embed.addFields({ name: '__Height__', value: `${resInfo.height}`, inline: true })
        embed.setTimestamp()
        if (interaction.guild) {
            embed.setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });
        }


        await interaction.editReply({embeds: [embed], files:[attachment]})

    }
}