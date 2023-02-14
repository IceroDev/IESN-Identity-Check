require("dotenv").config();

module.exports = {
  name: "role",
  description: "Modifie vos rôles IESN Squad",
  options: [
    {
      type: 3,
      name: "role",
      description: "Le rôle à ajouter/retirer [IR, TI, B1, B2, B3 ou Diplome]",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    var member = guild.members.cache.find((m) => m.id === interaction.user.id);
    var role = interaction.options.getString("role");

    /* It's checking if the user has the verified role. If not, it will send a message saying that the
    user needs to have a verified account to do this. */
    if (!member.roles.cache.has(process.env.VERIFIED_ROLE_ID))
      return interaction.reply({
        content: ":x: Vous devez avoir un compte vérifié pour faire cela.",
        ephemeral: true,
      });

    var impactedRole;

    if (role == "IR") {
      impactedRole = process.env.IR;
    } else if (role == "TI") {
      impactedRole = process.env.TI;
    } else if (role == "B1") {
      impactedRole = process.env.FIRST_ID;
    } else if (role == "B2") {
      impactedRole = process.env.SECOND_ID;
    } else if (role == "B3") {
      impactedRole = process.env.THIRD_ID;
    } else if (role == "Diplome") {
      impactedRole = process.env.GRADUATE_ID;
    } else {
      impactedRole = "X";
    }

    /**
     * It takes a role ID and returns an array of role IDs that the user should be removed from.
     * </code>
     * @param roleID - The ID of the role that the user wants to add
     * @returns the array of roles to remove.
     */
    function rolesToRemove(roleID) {
      var toRemoveList;
      var years = [
        process.env.FIRST_ID,
        process.env.SECOND_ID,
        process.env.THIRD_ID,
        process.env.GRADUATE_ID,
      ];
      var sections = [process.env.IR, process.env.TI];
      if (years.includes(roleID)) {
        years.splice(years.indexOf(roleID), 1);
        toRemoveList = years;
      } else if (sections.includes(roleID)) {
        sections.splice(sections.indexOf(roleID), 1);
        toRemoveList = sections;
      } else {
        return interaction.reply({
          content: ":x: Ce rôle n'existe pas",
          ephemeral: true,
        });
      }
      return toRemoveList;
    }


    /* It's checking if the role is valid. If it's not, it will send a message saying that the role
    doesn't exist. */
    if (impactedRole == "X")
      return interaction.reply({
        content: ":x: Le rôle donné n'existe pas",
        ephemeral: true,
      });

    /* It's checking if the user already has the role. If he does, it will send a message saying that
    the user already has the role. */
    if (member.roles.cache.has(impactedRole))
      return interaction.reply({
        content: ":x: Vous avez déjà le rôle demandé.",
        ephemeral: true,
      });

    var toRemove = rolesToRemove(impactedRole);

    /* It's adding the role that the user wants and removing the roles that the user shouldn't have. */
    member.roles.add(impactedRole).catch();
    toRemove.forEach((element) => {
      member.roles.remove(element).catch();
    });

    /* It's sending a message to the user saying that the role has been added and the other roles have
    been removed. */
    interaction.reply({
      content:
        ":white_check_mark: Je vous ai donné le rôle demandé et retiré ceux qui ne correspondaient pas.",
      ephemeral: true,
    });
  },
};
