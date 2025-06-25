import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(
      `This comand was run by ${interaction.user.username}, who joined on ${
        interaction.member && "joinedAt" in interaction.member
          ? interaction.member.joinedAt
          : "Unknown Date"
      }.`
    );
  },
};
