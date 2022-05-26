const {GuildMember} = require('discord.js');

module.exports = {
  name: 'volume',
  description: 'Change the volume!',
  options: [
    {
      name: 'volume',
      type: 4, // 'INTEGER' Type
      description: 'Number between 0-200',
      required: true,
    },
  ],
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

    var volume = interaction.options.get('volume').value;
    volume = Math.max(0, volume);
    volume = Math.min(200, volume);
    const success = queue.setVolume(volume);

    return void interaction.followUp({
      content: success ? `🔊 | Volume set to ${volume}!` : '❌ | Something went wrong!',
    });
  },
};
