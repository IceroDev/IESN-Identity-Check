var mysql = require("mysql2");
require("dotenv").config();

module.exports = {
  name: "delete",
  description:
    "supprime vos données de la base de données. Supprime aussi vos accès au serveur",
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

          /* It's sending a message to the user. */
          interaction.reply({
            content:
              ":white_check_mark: Vos données ont été supprimées. Vous serez ejecté du serveur dans 10 secondes.",
            ephemeral: true,
          });

          /* It's kicking the user from the server after 10 seconds. */
          setTimeout(() => {
            const guild = client.guilds.cache.get(process.env.GUILD_ID);
            const member = guild.members.cache.find(
              (m) => m.id === interaction.user.id
            );
            member
              .kick(
                "L'utilisateur à demandé la suppression de ses données. Kick automatique"
              )
              .catch((error) => {
                console.log("ERROR, don't have perms");
              });
          }, 10000);
        }
      );
    }
  },
};
