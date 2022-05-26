const {GuildMember} = require('discord.js');
const {QueueRepeatMode} = require('discord-player');

module.exports = {
  name: 'loop',
  description: 'Sets loop mode',
  options: [
    {
      name: 'mode',
      type: 'INTEGER',
      description: 'Loop type',
      required: true,
      choices: [
        {
          name: 'Off',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Track',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Queue',
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: 'Autoplay',
          value: QueueRepeatMode.AUTOPLAY,
        },
      ],
    },
  ],
  async execute(interaction, player) {
    try {
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
      if (!queue || !queue.playing) {
        return void interaction.followUp({content: '❌ | Neanche un cazzo di song!'});
      }

      const loopMode = interaction.options.get('mode').value;
      const success = queue.setRepeatMode(loopMode);
      const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

      return void interaction.followUp({
        content: success ? `${mode} | Loop aggiornato!` : '❌ | Non worka il loop, rip!',
      });
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
