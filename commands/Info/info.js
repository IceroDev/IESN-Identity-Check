const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
var mysql = require("mysql2");

module.exports = {
  name: "info",
  description: "Affiche des informations de la base de données."
  ,

  run: async (client, interaction) => {

    /* It's checking if the user who is using the command has the permission "ManageMessages" and if he
    has it, it will set the variable "perms" to true and it will set the variable "memberQuery" to
    the member who has the ID "dID" (the ID of the user who is using the command). If the user
    doesn't have the permission "ManageMessages", it will set the variable "perms" to false and it
    will set the variable "memberQuery" to the member who has the ID "interaction.user.id" (the ID
    of the user who is using the command). */

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
      `SELECT * FROM users WHERE id_discord='${interaction.user.id}';`,
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
              interaction.user.displayAvatarURL({
                size: 512,
                dynamic: true,
                format: "png",
              })
            );

          return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          return interaction.reply({
            content:
              ":x: Votre compte n'existe pas dans la base de donnée. (Si vous êtes quand même vérifié, un administrateur vous a probablement validé manuellement)",
            ephemeral: true,
          });
        }
      }
    );
  },
};
