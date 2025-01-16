var mysql = require("mysql2");
require("dotenv").config();

module.exports = {
    name: "adminreset",
    description:
        "Force le clear database d'un utilisateur en cas d'erreur de reception de l'email.",
    options: [
        {
            type: 3,
            name: "discordid",
            description:
                "ID Discord de l'utilisateur a wipe.",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        var conf = interaction.options.getString("discordid")
        //check if user has permissions administrator
        if (interaction.user.id != process.env.ADMIN_ID)
            return interaction.reply({
                content: ":x: Seul le gestionnaire de base de données peut utiliser cette commande.",
                ephemeral: true,
            });

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
            `DELETE FROM users WHERE id_discord='${conf}';`,
            function (error, results, fields) {

                /* It's sending a message to the user if there is an error. */
                if (error) {
                    return interaction.reply({
                        content:
                            ":x: Impossible de communiquer avec la base de données. Il est aussi possible que l'utilisateur n'ait jamais demandé de vérification.",
                        ephemeral: true,
                    });
                }

                /* It's sending a message to the user. */
                interaction.reply({
                    content:
                        `:white_check_mark: Utilisateur <@!${conf}> wipe. Vous pouvez relancer la vérification`,
                    ephemeral: false,
                });

            }
        );
    },
};
