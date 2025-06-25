const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

type CommandInteractionTypeCustom = typeof CommandInteraction;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction: CommandInteractionTypeCustom): Promise<void> {
    await interaction.reply("Pong!");
  },
};
