const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
var mysql = require("mysql2");

module.exports = {
  name: "info",
  description: "Affiche des informations de la base de données.",
  options: [
    {
      type: 3,
      name: "id",
      description: "ID Discord",
      required: true,
    },
  ],

  run: async (client, interaction) => {

    let perms;
    let memberQuery;

    var dID = interaction.options.getString("id");

    /* It's getting the guild and the member from the guild. */
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    var member = guild.members.cache.find((m) => m.id === interaction.user.id);

    /* It's checking if the user who is using the command has the permission "ManageMessages" and if he
    has it, it will set the variable "perms" to true and it will set the variable "memberQuery" to
    the member who has the ID "dID" (the ID of the user who is using the command). If the user
    doesn't have the permission "ManageMessages", it will set the variable "perms" to false and it
    will set the variable "memberQuery" to the member who has the ID "interaction.user.id" (the ID
    of the user who is using the command). */
    if (member.permissions.has("ManageMessages")) {
      perms = true;
      memberQuery = guild.members.cache.find((m) => m.id === dID);
    } else {
      perms = false;
      memberQuery = guild.members.cache.find(
        (m) => m.id === interaction.user.id
      );
    }

    /* It's connecting to the database. */
    var con = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    con.connect(function (err) {
      if (err) throw err;
    });


    /* It's getting the data from the database. */
    con.query(
      `SELECT * FROM users WHERE id_discord='${dID}';`,
      function (error, results, fields) {
        if (error) {
          return interaction.reply({
            content:
              ":x: Impossible de communiquer avec la base de données. Pouvez vous contacter un administrateur ?",
            ephemeral: true,
          });
        }
        /* It's checking if the user is in the database. If he is, it will send an embed with the
        information of the user. If he isn't, it will send a message saying that the user isn't in
        the database. */
        if (results[0]) {
          /* It's creating an embed with the information of the user. */
          const embed = new EmbedBuilder()
            .setTitle("Informations")
            .setDescription(
              `• **Mail (hashé) : **${results[0].mail}
                • **À lancé la vérification le : **${
                  results[0].date_inscription
                }
                `
            )
            .setThumbnail(
              memberQuery.displayAvatarURL({
                size: 512,
                dynamic: true,
                format: "png",
              })
            );

          /* It's checking if the user has the permission "ManageMessages" and if he has it, it will
          add a field in the embed with the code of the user. */
          if (perms) {
            embed.addFields({
              name: "Code envoyé par mail",
              value: `${results[0].code}`,
            });
          }

          return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          return interaction.reply({
            content:
              ":x: Je ne trouve pas votre compte Discord dans la base de données. Veuillez demander un code avec la commande /verify",
            ephemeral: true,
          });
        }
      }
    );
  },
};
