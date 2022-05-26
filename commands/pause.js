const {GuildMember} = require('discord.js');

module.exports = {
  name: 'pause',
  description: 'Pause current song!',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'Si ma non sei nel mio voice channel, coglione!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: 'Si ma non sei nel mio voice channel coglione!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | Neanche un cazzo di song!',
      });
    const success = queue.setPaused(true);
    return void interaction.followUp({
      content: success ? '⏸ | Paused!' : '❌ | Something went wrong!',
    });
  },
};
