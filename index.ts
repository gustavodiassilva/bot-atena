import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "node:fs";
import path from "node:path";

dotenv.config();

const token: string | undefined = process.env.DISCORD_TOKEN;

interface CustomClient extends Client {
  commands: Collection<string, any>;
  cooldowns: Collection<string, any>;
}

if (!token) {
  console.error("token is not provided");

  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
}) as CustomClient;

client.commands = new Collection();

client.cooldowns = new Collection();

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
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
