var nodemailer = require("nodemailer");
var mysql = require("mysql2");
var crypto = require("crypto");

require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

module.exports = {
  name: "verify",
  description: "Ajoute vos accès à IESN Squad",
  options: [
    {
      type: 3,
      name: "email",
      description: "Votre adresse email au format etuXXXXX@henallux.be",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    var mail = interaction.options.getString("email");

    /* It's checking if the email is valid. */
    if (!mail.startsWith("etu") || !mail.includes("@henallux.be"))
      return await interaction.reply({
        content:
          "Votre email est invalide. Assurez vous d'utiliser l'email sous sa forme etuXXXXX@henallux.be. Aucun redirecteur n'est autorisé.",
        ephemeral: true,
      });
    if (mail.includes("+"))
      return await interaction.reply({
        content: "Bien essayé, mais c'est bloqué.",
        ephemeral: true,
      });
    if (mail == "etuXXXXX@henallux.be")
      return await interaction.reply({
        content:
          "Ceci n'est pas votre email. Utilisez votre réel email étudiant.",
        ephemeral: true,
      });

    /* It's generating a random code for the user to verify his email. */
    var code = Math.random().toString(36).slice(2, 10);

    /* It's generating an email with the code. */
    var mailOptions = {
      from: "IESN Squad Administration Team",
      to: mail,
      subject: `Votre code de vérification pour Discord est ${code}`,
      text: `Bonjour ${interaction.user.tag} !\n\nVous avez demandé à rejoindre IESN Squad et votre demande a été acceptée. Vérifiez votre compte avec la commande /code en inscrivant le code suivant : ${code}\n\n\nÀ tout de suite !\nL'administration IESN Squad`,
    };

    /* It's hashing the email with the cipher defined in the .env file. */
    mail = crypto.createHash(process.env.HASH_CIPHER).update(mail).digest("hex");

    /* It's creating a transporter to send the email. */
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    /* It's checking if the email is already in the database. */
    con.query(
      `SELECT * FROM users WHERE mail='${mail}';`,
      function (error, results, fields) {
        /* It's checking if there is an error in the database. */
        if (error) {
          return interaction.reply({
            content:
              ":x: Impossible de communiquer avec la base de données. Pouvez vous contacter un administrateur ?",
            ephemeral: true,
          });
        }

        /* It's checking if the email is already in the database. */
        if (results.length != 0)
          return interaction.reply({
            content:
              ":x: Cette email a déjà reçu un code. Veuillez vérifier votre boîte mail",
            ephemeral: true,
          });

        /* It's sending the email and then inserting the data in the database. */
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            return interaction.reply({
              content:
                "L'envoi du code de confirmation a échoué. Cela n'est pas de votre faute. Pouvez vous contacter un administrateur IESN Squad en message privé ?",
              ephemeral: true,
            });
          } else {
            con.connect(function (err) {
              if (err) throw err;
            });

            con.query(
              `INSERT INTO users (id_discord, code, mail) VALUES ('${interaction.user.id}', '${code}', '${mail}');`,
              function (error, results, fields) {
                if (error) {
                  console.log(error);
                  return interaction.reply({
                    content:
                      ":x: Impossible de communiquer avec la base de données. Pouvez vous contacter un administrateur ?",
                    ephemeral: true,
                  });
                }
                return interaction
                  .reply({
                    content:
                      ":white_check_mark: Inscription envoyée. Vérifiez vos emails pour le code de confirmation.",
                    ephemeral: true,
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            );
          }
        });
      }
    );
  },
};
