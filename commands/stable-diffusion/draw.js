const { AttachmentBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data:{
        name: "draw",
        description: "generate a picture with stable diffusion",
        options: [
			{
				name: "prompt",
				description: "prompt",
				required: true,
				type: ApplicationCommandOptionType.String,
			},
        ],
        integration_types: [0,1],
        contexts:[0,1,2],
    },
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const prompt_string = interaction.options.get('prompt').value;

        const payload = {
            "prompt": prompt_string,
            "steps": 10,
            "seed": -1,
        }

        const response = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(payload)
        })

        let result = await response.json()
        // console.log(result.images[0]);

        const buffer = Buffer.from(result.images[0], 'base64')
        const attachment = new AttachmentBuilder(buffer, {name: 'image.png'})

        await interaction.editReply({files:[attachment]})
        
    }
}