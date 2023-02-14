const { EmbedBuilder } = require("discord.js");

/**
 * It creates an embed with the given parameters.
 * @param command - The command name
 * @param user - The user who used the command
 * @param thumbnail - The thumbnail of the embed
 * @param text - The text that will be displayed in the embed
 * @param footer - The footer of the embed
 * @param error - Boolean
 * @returns The embed object.
 */
function createEmbed(command, user, thumbnail, text, footer, error){
    const embed = new EmbedBuilder()
    .setTitle(`Commande ${command} utilisée par ${user}`)
    .setDescription(text)
    .setThumbnail(thumbnail)
    .setFooter(footer)

    if(error){
        embed.setColor("RED");
    }else{
        embed.setColor("GREEN")
    }

    return embed
}

module.exports = {createEmbed}