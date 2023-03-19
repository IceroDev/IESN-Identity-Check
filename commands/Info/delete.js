var mysql = require("mysql2");
require("dotenv").config();

module.exports = {
  name: "delete",
  description:
    "supprime vos données de la base de données. Supprime aussi votre vérification",
  options: [
    {
      type: 3,
      name: "confirmation",
      description:
        "Cette action est irreversible. En écrivant oui vous confirmez la suppression.",
      required: true,
    },
  ],

  run: async (client, interaction) => {

    var conf = interaction.options.getString("confirmation");

    if (conf == "oui") {

      /* It's connecting to the database. */
      var con = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      });
      con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
      });

      /* It's deleting the user from the database. */
      con.query(
        `DELETE FROM users WHERE id_discord='${interaction.user.id}';`,
        function (error, results, fields) {

          /* It's sending a message to the user if there is an error. */
          if (error) {
            return interaction.reply({
              content:
                ":x: Impossible de communiquer avec la base de données. Pouvez vous contacter un administrateur ?",
              ephemeral: true,
            });
          }
          const guild = client.guilds.cache.get(process.env.GUILD_ID);
          const member = guild.members.cache.find(
            (m) => m.id === interaction.user.id
          );
          member.roles.remove(member.roles.cache).catch(error => console.log(error));

          /* It's sending a message to the user. */
          interaction.reply({
            content:
              ":white_check_mark: Vos données ont été supprimées.",
            ephemeral: true,
          });

        }
      );
    } else {
      interaction.reply({
        content:
          ":x: Opération annulée",
        ephemeral: true,
      });
    }
  },
};
