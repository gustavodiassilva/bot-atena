import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
import path from "node:path";
dotenv.config();
const token: string | undefined = process.env.DISCORD_TOKEN;
const clientId: string | undefined = process.env.CLIENT_ID;
const guildId: string | undefined = process.env.GUILD_ID;
const isGlobal: string | undefined = process.env.IS_GLOBAL_COMMANDS;

if (!token) {
  console.error("token is not provided");
  process.exit(1);
}
if (!clientId) {
  console.error("clientId is not provided");
  process.exit(1);
}
if (!guildId) {
  console.error("guildId is not provided");
  process.exit(1);
}
const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const route = isGlobal
      ? Routes.applicationCommands(clientId)
      : Routes.applicationGuildCommands(clientId, guildId);

    const data = (await rest.put(route, { body: commands })) as unknown[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
