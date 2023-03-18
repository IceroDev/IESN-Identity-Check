const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.tag} is up and ready to go!`);
  client.user.setPresence({
    status: "online",
  });

  var status = [
    "henallux.be",
    "Un problème ? Ouvrez une issue sur GitHub !",
    "👋",
  ]
  setInterval(function () {
    var toDisplay = status[Math.floor(Math.random()*status.length)];
    client.user.setActivity(toDisplay);
  }, 15000); 
  
});
