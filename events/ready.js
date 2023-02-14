const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.tag} is up and ready to go!`);
  client.user.setPresence({
    status: "online",
  });
  client.user.setActivity("henallux.be", { type: 3 });
});
