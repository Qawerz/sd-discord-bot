const { AttachmentBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data:{
        name: "modal-draw",
        description: "generate a picture with stable diffusion (modal)",
        integration_types: [0,1],
        contexts:[0,1,2],
    },
    devOnly: true,
    callback: async (client, interaction) => {
        const modal = new ModalBuilder({
            customId: `myModal-${interaction.user.id}`,
            title: "My Stable Diffusion"
        });

        const positivePormptInput = new TextInputBuilder({
            customId: `positivePormptInput`,
            label: "Prompt",
            style: TextInputStyle.Short,
        })

        const negativePormptInput = new TextInputBuilder({
            customId: `negativePormptInput`,
            label: "Negative Prompt",
            style: TextInputStyle.Paragraph,
            required: false,
        })

        const firstActionRow = new ActionRowBuilder().addComponents(positivePormptInput)
        const secondActionRow = new ActionRowBuilder().addComponents(negativePormptInput)
        

        modal.addComponents(firstActionRow, secondActionRow)

        await interaction.showModal(modal)

        const filter = (interaction) => interaction.customId === `myModal-${interaction.user.id}`;


        interaction
            .awaitModalSubmit({filter, time: 30_000})
            .then(async (modalInteraction) => {
                const prompt = modalInteraction.fields.getTextInputValue("positivePormptInput")
                const nprompt = modalInteraction.fields.getTextInputValue("negativePormptInput")

                if (!modalInteraction.isModalSubmit()) return;
                await modalInteraction.deferReply();

                const payload = {
                    "prompt": prompt,
                    "steps": 15,
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

                const buffer = Buffer.from(result.images[0], 'base64')
                const attachment = new AttachmentBuilder(buffer, {name: 'image.png'})

                await modalInteraction.editReply({files:[attachment]})
            })
            .catch((err)=>{
                console.log(err);
            })
    }
}