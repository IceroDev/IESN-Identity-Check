require("dotenv").config();
var mysql = require("mysql2");

module.exports = {
  name: "code",
  description: "Ajoute vos accès à IESN Squad",
  options: [
    {
      type: 3,
      name: "code",
      description: "Le code que vous avez reçu sur votre boîte mail.",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    /* It's creating a connection to the database. */
    var con = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    con.connect(function (err) {
      if (err) throw err;
    });

    con.query(
      `SELECT * FROM users WHERE id_discord='${interaction.user.id}';`,
      function (error, results, fields) {

        /* It's checking if there is an error. If there is, it's sending a message to the user. */
        if (error) {
          return interaction.reply({
            content:
              ":x: Impossible de communiquer avec la base de données. Pouvez vous contacter un administrateur ?",
            ephemeral: true,
          });
        }

        /* It's checking if there is a result. If there is, it's saving the code in a variable. */
        if (results[0]) {
          var code = results[0].code;
        }

        /* It's checking if there is a result. If there is, it's saving the code in a variable. */
        if ((results.length = 0))
          return interaction.reply({
            content:
              ":x: Je ne trouve pas votre compte Discord dans la base de données. Veuillez demander un code avec la commande /verify",
            ephemeral: true,
          });

        var toCheck = interaction.options.getString("code");

        /* It's checking if the code is the same as the one in the database. If it's not, it's sending
        a message to the user. */
        if (code !== toCheck)
          return interaction.reply({
            content: ":x: Le code n'est pas celui envoyé par mail. Réessayez.",
            ephemeral: true,
          });

        /* It's getting the guild and the member. */
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const member = guild.members.cache.find(
          (m) => m.id === interaction.user.id
        );

        /* It's checking if the user has the verified role. If he has, it's sending a message to the
        user. */
        if (member.roles.cache.has(process.env.VERIFIED_ROLE_ID))
          return interaction.reply({
            content: ":x: Vous êtes déjà vérifié.",
            ephemeral: true,
          });

        /* It's adding the verified role to the user. */
        member.roles
          .add(process.env.VERIFIED_ROLE_ID)
          .catch((error) => console.log(error));
        return interaction.reply({
          content: "Vous êtes désormais vérifié ! Bienvenue :tada:",
          ephemeral: true,
        });
      }
    );
  },
};
