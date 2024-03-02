const Discord = require('discord.js');
const client = new Discord.Client({ intents: [32767] });
const { token, color, config, colorv } = require('./config.json');
const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } = require('discord.js');
const db = require("quick.db");
const Canvas = require('canvas');
const { bvn, logs, ticket, sug, avis, ok, no, dev, prefix } = require('./database.json');
const now = new Date();

///ready///
client.on('ready', async () => {
  console.log(`${client.user.tag} est en cours d'allumage...`);

  const servercount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)

  const activities = [
    `${servercount} utilisateurs !`,
    `https://discord.gg/7m5zwGkz9u`
  ];

  setInterval(() => {

    client.user.setPresence({
      activities: [
        {
          name: `Partner Project | ps.`,
          type: 'STREAMING',
	        url: 'https://www.twitch.tv/partnerproject'
        }
      ]
    });
  }, 5000);
});
///arrivée///
client.on('guildMemberAdd', async (member) => {
  member.send({
    embeds: [
      new MessageEmbed()
        .setTitle(`<:Partner_Welcome:992734094238679090> | Bienvenue sur ` + member.guild.name + ` !`)
        .setDescription(`> <:Partner_Logo:992099488653123634> **| Partner est un** *\`bot\`* **Discord permettant de faire un partenariat en toute sécurité et sans la présence de modérateur, pour plus d'informations, rendez-vous dans la catégorie **\`📙 • Informations\`\n\n> <:Partner_Ticket:992182575420407839>** | En cas de questions ou de problèmes, n'hésitez pas à ouvrir un ticket à l'aide du menu présent dans le salon** <#991989413548675187>` + '\n\n> <:Partner_Partner:992104887984861354> **| Pour ajouter le bot rendez-vous dans le salon <#992362626216632350> !**')
        .setColor(color)]
  })
  member.roles.add('991989412575576153')
  const canvas = Canvas.createCanvas(1024, 500)

  ctx = canvas.getContext('2d')
  const background = await Canvas.loadImage('./bvn.png')
  ctx.drawImage(background, 0, 0, 1024, 500)
  ctx.font = '60px Impact';
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = 'center';
  ctx.fillText(member.user.tag.toUpperCase(), 512, 385)
  ctx.font = '55px Caltons Typeface Demo Version';
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = 'center';
  ctx.fillText("Nous sommes maintenant " + member.guild.memberCount, 512, 450)

  ctx.beginPath();
  ctx.arc(512, 166, 119, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
    format: "png",
    size: 1024
  }));

  ctx.drawImage(avatar, 393, 47, 238, 238)

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png")

 client.channels.cache.get(bvn).send({ files: [attachment], content: "Bienvenue <@" + member.user.id + "> ! Nous espérons que tu passeras un agréable moment parmi nous !" })
});
///logs///
client.on('messageUpdate', async (message) => {
  if (message.author.bot) return;
 client.channels.cache.get(logs).send({
    embeds: [
      new MessageEmbed()
        .setColor(color)
        .setTitle('<:Partner_Pen:993120823445553282>  | Message modifié')
        .setDescription('**<:Partner_Channel:992125913535889460>  | Salon:**\n```' + message.channel.id + ' | #' + message.channel.name + '``` \n**<:Partner_Pen:993120823445553282>  | Contenu modifié:** \n```' + message.content.slice() + '``` \n<:Partner_Welcome:992734094238679090> **| Auteur:**\n```' + message.author.id + ' | ' + message.author.tag + '```')
    ]
  })
});
client.on('channelCreate', async (channel) => {
  if ((String((channel.name)).includes(String('ticket')))) return;
  channel.guild.fetchAuditLogs({ type: 10 }).then((audit) => {
    const creator = audit.entries.find((a) => a.target.id == `${channel.id}`)?.executor;
    console.log(creator.tag);
   client.channels.cache.get(logs).send({
      embeds: [
        new MessageEmbed()
          .setColor(color)
          .setTitle('<:Partner_Channel:992125913535889460>   | Salon créer')
          .setDescription('<:Partner_Pen:993120823445553282>| **Salon:**\n```' + `${channel.id}` + ' | #' + channel.name + '``` \n<:Partner_Welcome:992734094238679090> **| Auteur:**\n```' + creator.tag + ' | ' + creator.username + '```')
      ]
    })
  });

});
client.on('channelUpdate', async (channel) => {
  if (channel.permissionOverwrites.edit) return;
  if ((String((channel.name)).includes(String('ticket')))) return;
  channel.guild.fetchAuditLogs({ type: 10 }).then((audit) => {
    const creator = audit.entries.find((a) => a.target.id == `${channel.id}`)?.executor;
   client.channels.cache.get(logs).send({
      embeds: [
        new MessageEmbed()
          .setColor(color)
          .setTitle('<:Partner_Channel:992125913535889460>   | Salon modifié')
          .setDescription('<:Partner_Pen:993120823445553282>| **Salon modifié:**\n```' + `${channel.id}` + ' | #' + channel.name + '``` \n<:Partner_Welcome:992734094238679090> **| Auteur:**\n```' + creator.tag + ' | ' + creator.username + '```')
      ]
    })
  })
});
client.on('channelDelete', async (channel) => {
  if ((String((channel.name)).includes(String('ticket')))) return;
  channel.guild.fetchAuditLogs({ type: 10 }).then((audit) => {
    const creator = audit.entries.find((a) => a.target.id == `${channel.id}`)?.executor;
    console.log(creator.tag);
   client.channels.cache.get(logs).send({
      embeds: [
        new MessageEmbed()
          .setColor(color)
          .setTitle('<:Partner_Delete:993149012150599770>   |** Salon supprimé**')
          .setDescription('<:Partner_Pen:993120823445553282>| **Salon supprimé:**\n```' + `${channel.id}` + ' | #' + channel.name + '``` \n<:Partner_Welcome:992734094238679090> **| Auteur:**\n```' + creator.tag + ' | ' + creator.username + '```')
      ]
    })
  })
});
///commandes///
client.on('messageCreate', async (message) => {
    if (message.author.bot)return;
  ///delay///
  if (message.content === prefix + "ping") {
    message.reply(`Le bot a actuellement **__${Math.round(client.ws.ping)} millisecondes__** de delay.`);
  };
  ///Ticket_ennd///
  if ((message.content).startsWith(prefix + 'ticket_end')) {
    if (message.member.roles.cache.has('993258536245133404')) {
      var embed = new MessageEmbed()
      .setColor('#5a5a5a')
      .setDescription("Nous ésperons avoir répondu à toutes vos question !\n **N'oubliez pas de laisser un avis dans le salon <#991989413385084935> ou une suggestion dans le salon <#991989413385084936> :)**")
      message.channel.send({embeds: ([embed])})
      message.delete()
    } else {
      var embed = new MessageEmbed()
      .setColor('#5a5a5a')
      .setDescription("Vous devez faire parti du l'équipe du Partner Support pour poursuivre !")
      message.reply({embeds: ([embed])})
    }
  }
  ///help///
  if (message.content === prefix + "help") {
    const hlp = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('help')
          .setPlaceholder('Menu Principal')
          .addOptions([
            {
              label: 'Utilitaire',
              emoji: '🔧',
              value: '1'
            },
            {
              label: 'Modération',
              emoji: '🔨',
              value: '2'
            },
            {
              label: 'Administration',
              emoji: '💣',
              value: '3'
            },
            {
              label: 'Acceuil',
              emoji: '🏠',
              value: '4'
            }
          ])

      )
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle('<:Partner_Logo:992099488653123634> | __Menu d\'aide du bot **Partner Support**.__')
          .setDescription('- Bot Support `officiel` de **Partner** *le premier bot à permettre de faire des partenariats sans modérateur*,  je possède de nombreuses commandes que vous pouvez consulter en interagissant avec le menu ci-dessous.\n\n- Mon développeur est **Soren#3176(<@566889361233412111>)**, si tu veux avoir une version similaire de moi-même, contact le en MP.\n\n> **<:Partner_Tick:992734092972003349> = Commandes disponibles\n> <:Partner_Cross:992734085648748604> = Commandes indisponibles\n> <:Partner_Pen:993120823445553282> = Commandes en cours de développement...**')
          .setColor(color)
      ], components: [hlp]
    })
  };
  ///reacctionroles///
  if (message.content === prefix + "panelrole") {
    if (!message.member.roles.cache.has('993258536245133404')) return;
    message.channel.bulkDelete(1)
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder('Menu Principal')
          .setMinValues(1)
          .setMaxValues(4)
          .addOptions([
            {
              label: "Annonce",
              description: 'Pour être notifié des annonces.',
              emoji: '📢',
              value: '1'
            },
            {
              label: 'Mise à jour',
              description: 'Pour être notifié des Mises à Jours.',
              emoji: '📰',
              value: '2'
            },
            {
              label: 'Partenariat',
              description: 'Pour être informé des nouveaux Partenariats.',
              emoji: '🤝',
              value: '3'
            },
            {
              label: 'Sondage',
              description: 'Pour être notifié à chaque sondages.',
              emoji: '🔎',
              value: '4'
            },
          ])
      );
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle('<:Partner_Notification:992727141340954624> | Notifications rôles')
          .setDescription('Récupérez vos rôles de notifications ici-même à l\'aide du menu déroulant ci-dessous !\n> **📢 = Annonces\n> 📰 = Mises à jours\n> 🤝 = Partenariats\n> 🔎 = Sondages**')
          .setColor(color)
      ], components: [row]
    })
  };
  ///suggestion///
  if (message.channel.id === sug) {
    if (message.author.bot) return;
     message.delete()
    const sugge = message.content;
    const suggest = await new MessageEmbed()
      .setTitle('<:Partner_Arrow:992734082914066442>  | __Nouvelle suggestion:__')
      .setDescription('```' + sugge + "```\n\n<:Partner_Tick:992734092972003349> = Je suis d'accord.\n<:Partner_Cross:992734085648748604> = Je ne suis pas d'accord.")
      .setFooter({ text: `Suggestion donné par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }) })
      .setColor(color)
    message.channel.send({ embeds: [suggest] }).then(m => { m.react('Partner_Tick:992734092972003349'), m.react("Partner_Cross:992734085648748604") })
  };
  ///claim///  
  if (message.content === prefix + "claim") {
    if (message.channel.parentId !== "993231221071028294") return;
    if (!message.member.roles.cache.has('993258536245133404')) return;
    message.reply({
      embeds: [new MessageEmbed()
        .setTitle('Ticket réclamé')
        .setDescription('Votre ticket sera traité par <@' + message.author.id + '>')
        .setColor(color)
      ]
    })
  };
  ///panelticket/// 
  if (message.content === prefix + "panelticket") {
    if (message.channel.type === "DM") return;
    message.channel.bulkDelete(1)
    message.channel.send({
      embeds: [new MessageEmbed()
        .setTitle('__<:Partner_Ticket:992182575420407839> | Ouvrir un ticket__')
        .setDescription('Pour **ouvrir un ticket**, il vous suffit de **choisir** parmi les **quatre propositions** celle qui définie le mieux la **raison pour laquelle vous souhaitez ouvrir ce ticket.**\n\n** > <:Partner_Help:993250377518546964> = Aide / Plainte\n> <:Partner_Bug:993249429140279417> = Bug / Erreur \n> <:Partner_Verify:992099544198295602> = Demande vérification \n> <:Partner_Moderator:992110132538376272> = Recrutement \n> <:Partner_Ultimate:992099675706507274> = Ultimate**')
        .setColor(color)
        .setFooter({ text: "Le support de Partner est à votre écoute.", iconURL: "https://cdn.discordapp.com/attachments/992819468457738290/993139554037026946/Partner_Project_Logo.png" })
      ], components: [
        new MessageActionRow()
          .addComponents(new MessageSelectMenu()
            .setCustomId('tickets')
            .setPlaceholder('Menu Principale')
            .addOptions([
              {
                label: "Aide / Plainte",
                emoji: '<:Partner_Help:993250377518546964>',
                value: '1'
              },
              {
                label: "Bug / Erreur",
                emoji: "<:Partner_Bug:993249429140279417>",
                value: '2'
              },
              {
                label: "Demande vérification",
                emoji: "<:Partner_Verify:992099544198295602>",
                value: '5'
              },
              {
                label: "Recrutement",
                emoji: "<:Partner_Moderator:992110132538376272>",
                value: '3'
              },
              {
                label: 'Ultimate',
                emoji: '<:Partner_Ultimate:992099675706507274>',
                value: "4"
              }
            ]))
      ]
    })
  };
  ///destroy///
    if (message.content === prefix + 'destroy'){
      if ((message.author.id === '566889361233412111') || (message.author.id === '397406757422628869')) {
        client.destroy();
      } else {
        message.reply({content: 'Vons n\'avez pas la permissions d\'effectuer cette commande.'})
      }
    }
  ///clear///
  if (message.content.startsWith(prefix + "clear")) {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply({ content: 'Vons n\'avez pas la permissions d\'effectuer cette commande.' })
    mssgg = message.content.slice(9)
    if (!mssgg) return message.reply({ content: "Vous devez entrer un nombre !" })
    if (mssgg < 1 || mssgg > 100) return message.reply({ content: 'Vous devez entrer un nombre entre 1 et 100 ! ' })
    message.channel.bulkDelete(mssgg)
    message.reply({ content: `${mssgg} messages ont bien étés supprimé !` })
  };
  ///lock///
  if (message.content === prefix + "lock") {
    if (message.member.permissions.has('991989412604940334')) {
      if (message.channel.permissionOverwrites.cache.get(message.guild.roles.everyone.id)?.deny.toArray(false).includes("SEND_MESSAGES")) return message.reply({ content: 'Ce salon est déjà lock.' })
    }
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
      SEND_MESSAGES: false
    })
    message.reply({ content: "Le salon a bien été lock." })
  };
  ///unlock///
  if (message.content === prefix + "unlock") {
    if (message.member.permissions.has('991989412604940334')) {
      if (!message.channel.permissionOverwrites.cache.get(message.guild.roles.everyone.id)?.deny.toArray(false).includes("SEND_MESSAGES")) return message.reply({ content: 'Ce salon n\'est pas vérouiller.' })
    }
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
      SEND_MESSAGES: true
    })
    message.reply({ content: "Le salon a bien été unlock." })
  };
  ///warn///
  if (message.content.startsWith(prefix + "warn")) {
    if (message.member.permissions.has('MANAGE_MESSAGES')) {
      const warnus = message.mentions.members.first()
      const reason = message.content.slice(30)
      if (!reason) return message.reply({ content: "Vous devez indiquer la raison." })
      db.set(`warn_${warnus.id}`, db.get(`warn_${warnus.id}`) + 1)
      message.reply({ content: `${warnus} a bien été warn pour \`\`${reason}\`\`` })
    }
  };
  ///sanctions///
  if (message.content.startsWith(prefix + "sanctions")) {
    if (message.member.permissions.has('MANAGE_MESSAGES')) {
      const warnus = message.mentions.members.first() || message.author
      const nub = db.get(`warn_${warnus.id}`)
      message.reply({ content: `${warnus} a actuellement \`\`${nub}\`\` warns.` })
    }
  };
  ///unwarn///
  if (message.content.startsWith(prefix + "unwarn")) {
    if (message.member.permissions.has('MANAGE_MESSAGES')) {
      const warnus = message.mentions.members.first() || message.author
      db.set(`warn_${warnus.id}`, db.get(`warn_${warnus.id}`) - 1)
      message.reply({ content: `${warnus} a bien été unwarn` })
    }
  };
  ///pub///
  if (message.content.startsWith(prefix + "pub")) {
    const et = new MessageEmbed()
      .setTitle('<:Partner_Announce:992191555756634185> | Notre Publicité')
      .setDescription(`\`\`\`🤖 **» Tu cherches un bot unique, utile et bien fait ?**\n\n🥏 **» Partner est un bot ayant pour seul but de faire des partenariat avec des serveurs, sans prendre contact et sans avoir besoin de modérateur !**\n\n👨‍💻 __**» Avec un travail acharné, nous avons réussi à réunir en un seule bot:**__ ***\n> 🧩| Un Design propre et organisé\n> 🔒| Une Sécurité optimale\n> 👶| Une utilisation facile et sans problème\n> 💳| Un bot gratuit***\n\n**🎓 » Nous recherchons de modérateurs ainsi que des démarcheurs (MARKETINGS)**\n\n**🎫| Lien d'invitation:** https://discord.gg/CJhCzvGs4e\n**🌅| Bannière:** https://imgur.com/a/9s7hxUl\`\`\``)
      .setColor(color)
    message.reply({ embeds: [et] })
  };
});
///interactions commandes///
client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    if (interaction.customId === "help") {
      switch (interaction.values[0]) {
        case '1':
          interaction.message.edit({
            embeds: [new MessageEmbed()
              .setDescription( ok + prefix + "`ping` = Afficher le delay du bot.\n" + ok + prefix + "`join_mess` = Afficher le messsage envoyé aux nouveaux membres.\n")
              .setColor(color)]
          })
          break;
        case '2':
          interaction.message.edit({
            embeds: [new MessageEmbed()
              .setDescription(ok + prefix + '`clear` = Permet de supprimer plusieurs messages en un seul coup.\n' + ok + prefix + "`ticket_end` = Afficher le message de fin de ticket.\n" + ok + prefix + "`pub` = Afficher la publicité du serveur.\n" +  ok + prefix + "`lock` = Fermer un salon\n" + ok + prefix + "`unlock` = Ouvrir un salon déjà fermé.\n" + ok + prefix + "`claim` = Réserver un ticket.\n" + ok + prefix + "`warn` = Sanctionner un utilisateur.\n" + ok + prefix + "`sanctions` = Voir le nombre de sanctions que possède un utilisateur.\n" + ok + prefix + "`unwarn` = Enlever une sanction à un utilisateur.")
              .setColor(color)
            ]
          })
          break;
        case "3":
          interaction.message.edit({
            embeds: [
              new MessageEmbed()
                .setDescription(ok + prefix + "`panelticket` = Afficher le panel des tickets.\n" + ok + prefix + "`panelrole` = Afficher le panel des reactions rôles.")
                .setColor(color)
            ]
          })

          break;
        case '4':
          interaction.message.edit({
            embeds: [
              new MessageEmbed()
                .setTitle('<:Partner_Logo:992099488653123634> | __Menu d\'aide du bot **Partner Support**.__')
                .setDescription('- Bot Support `officiel` de **Partner** *le premier bot à permettre de faire des partenariats sans modérateur*,  je possède de nombreuses commandes que vous pouvez consulter en interagissant avec le menu ci-dessous.\n\n- Mon développeur est **Soren#3176(<@566889361233412111>)**, si tu veux avoir une version similaire de moi-même, contact le en MP.\n\n> **<:Partner_Tick:992734092972003349> = Commandes disponibles\n> <:Partner_Cross:992734085648748604> = Commandes indisponibles\n> <:Partner_Pen:993120823445553282> = Commandes en cours de développement...**')
                .setColor(color)
            ]
          })
          break;
      }
    }
  };
  if (interaction.isSelectMenu()) {
    if (interaction.customId === "roles") {
      let role = {
        1: "991989412575576149",
        2: '991989412575576148',
        3: "991989412575576147",
        4: '991989412575576146'
      };
      for (let i = 0; i < interaction.values.length; i++) {
        interaction.member.roles.add(role[interaction.values[i]])
      }
      interaction.reply({ content: "Vos rôles vous ont bien été ajouté !", ephemeral: true })
    };

  };

  if (interaction.isSelectMenu()) {
    if (interaction.customId === 'tickets') {
      const channell = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, { type: "GUILD_TEXT" })
      await channell.setParent(ticket)

      const btnn = new MessageActionRow().addComponents(new MessageButton()
        .setStyle('DANGER')
        .setEmoji('🔒')
        .setLabel('Fermer le ticket')
        .setCustomId('close'),
        new MessageButton()
          .setStyle('SUCCESS')
          .setEmoji('🙋‍♂️')
          .setLabel('Réclamer')
          .setCustomId("Reclamer")
      )
      switch (interaction.values[0]) {
        case "1":
          await channell.permissionOverwrites.create(interaction.user, {
            SEND_MESSAGES: true,
            EMBED_LINKS: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
          await interaction.reply({ content: `Votre ticket a bien été créé ${channell}`, ephemeral: true });

          const embedt1 = new MessageEmbed()
            .setColor(color)
            .setTitle('<:Partner_Help:993250377518546964> | Aide / Plainte')
            .setDescription("<:Partner_Ticket:992182575420407839> | __**Règlement en Ticket**__\n\n> Vous devez ouvrir un ticket en cas de nécessité, ce n'est pas un jeu !\n\n> En ticket, un minimum de respect et de confiance est demandé, les modérateurs vous doivent le respect idem pour vous.\n> Lorsque vous ouvrez un ticket, exprimez de manière claire et précise votre problème en attendant l'arriver d'un modérateur.\n\nBonne continuation !")
            .setFooter({ text: `Ouvert par: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

          await channell.send({ embeds: [embedt1], components: [btnn] })
          await channell.send({ content: '@everyone' })
          channell.bulkDelete(1)


          break;

        case '2':
         
          await channell.permissionOverwrites.create(interaction.user, {
            SEND_MESSAGES: true,
            EMBED_LINKS: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
          await interaction.reply({ content: `Votre ticket a bien été créé ${channell}`, ephemeral: true })

          const embedt2 = new MessageEmbed()
            .setColor(color)
            .setTitle('<:Partner_Bug:993249429140279417> | Bug / Erreur')
            .setDescription("<:Partner_Ticket:992182575420407839> | __**Règlement en Ticket**__\n\n> Vous devez ouvrir un ticket en cas de nécessité, ce n'est pas un jeu !\n\n> En ticket, un minimum de respect et de confiance est demandé, les modérateurs vous doivent le respect idem pour vous.\n> Lorsque vous ouvrez un ticket, exprimez de manière claire et précise votre problème en attendant l'arriver d'un modérateur.\n\nBonne continuation !")
            .setFooter({ text: `Ouvert par: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

          await channell.send({ embeds: [embedt2], components: [btnn] })
          await channell.send({ content: '@everyone' })
          channell.bulkDelete(1)

          break;

        case "3":
        
          await channell.permissionOverwrites.create(interaction.user, {
            SEND_MESSAGES: true,
            EMBED_LINKS: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
          await interaction.reply({ content: `Votre ticket a bien été créé ${channell}`, ephemeral: true })

          const embedt3 = new MessageEmbed()
            .setColor(color)
            .setTitle('<:Partner_Moderator:992110132538376272> | Recrutement')
            .setDescription("<:Partner_Ticket:992182575420407839> | __**Règlement en Ticket**__\n\n> Vous devez ouvrir un ticket en cas de nécessité, ce n'est pas un jeu !\n\n> En ticket, un minimum de respect et de confiance est demandé, les modérateurs vous doivent le respect idem pour vous.\n> Lorsque vous ouvrez un ticket, exprimez de manière claire et précise votre problème en attendant l'arriver d'un modérateur.\n\nBonne continuation !")
            .setFooter({ text: `Ouvert par: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

          await channell.send({ embeds: [embedt3], components: [btnn] })
          await channell.send({ content: '@everyone' })
          channell.bulkDelete(1)
              

          break;

        case "4":

          await channell.permissionOverwrites.create(interaction.user, {
            SEND_MESSAGES: true,
            EMBED_LINKS: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
          await interaction.reply({ content: `Votre ticket a bien été créé ${channell}`, ephemeral: true })

          const embedt4 = new MessageEmbed()
            .setColor(color)
            .setTitle('<:Partner_Ultimate:992099675706507274> | Ultimate')
            .setDescription("<:Partner_Ticket:992182575420407839> | __**Règlement en Ticket**__\n\n> Vous devez ouvrir un ticket en cas de nécessité, ce n'est pas un jeu !\n\n> En ticket, un minimum de respect et de confiance est demandé, les modérateurs vous doivent le respect idem pour vous.\n> Lorsque vous ouvrez un ticket, exprimez de manière claire et précise votre problème en attendant l'arriver d'un modérateur.\n\nBonne continuation !")
            .setFooter({ text: `Ouvert par: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

          await channell.send({ embeds: [embedt4], components: [btnn] })
          await channell.send({ content: '@everyone' })
          channell.bulkDelete(1)

          break;

          case "5":
            
          await channell.permissionOverwrites.create(interaction.user, {
            SEND_MESSAGES: true,
            EMBED_LINKS: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
          await interaction.reply({ content: `Votre ticket a bien été créé ${channell}`, ephemeral: true })

          const embedt5 = new MessageEmbed()
            .setColor(color)
            .setTitle('<:Partner_Verify:992099544198295602> | Demande vérification')
            .setDescription("<:Partner_Ticket:992182575420407839> | __**Règlement en Ticket**__\n\n> Vous devez ouvrir un ticket en cas de nécessité, ce n'est pas un jeu !\n\n> En ticket, un minimum de respect et de confiance est demandé, les modérateurs vous doivent le respect idem pour vous.\n> Lorsque vous ouvrez un ticket, exprimez de manière claire et précise votre problème en attendant l'arriver d'un modérateur.\n\nBonne continuation !")
            .setFooter({ text: `Ouvert par: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()

          await channell.send({ embeds: [embedt5], components: [btnn] })
          await channell.send({ content: '@everyone' })
          channell.bulkDelete(1)

          break;
      };

    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === "Reclamer") {
      console.log(interaction)
      if (!interaction.member.roles.cache.has('993258536245133404')) return;
      interaction.reply({
        embeds: [new MessageEmbed()
          .setTitle('Ticket réclamé')
          .setDescription(`Votre ticket sera traité par ${interaction.user}`)
          .setColor(color)
        ]
      })
    }
    if (interaction.customId === "close") {
      let memberid = interaction.member.id
      await interaction.channel.delete()
      var embed = new MessageEmbed()
        .setColor(color)
        .setTitle('**Ticket Fermé**')
        .setTimestamp()
        .setDescription(`Fermé par:\n <@${memberid}> / \`${memberid}\``)
        client.channels.cache.get(logs).send({embeds: ([embed])})
      }
    
  };
  if (interaction.isButton()) {
    if (interaction.customId === "Change") {
      if (interaction.member.roles.cache.has("991989412604940334")) {
        interaction.message.edit({
          embeds: [new MessageEmbed()
            .setDescription("**Merci d'écrire le nouveau préfix ci dessous:**")
            .setColor(color)]
        })
        const msg_filter = (m) => m.author.id === interaction.user.id;
        interaction.channel.awaitMessages({ filter: msg_filter, max: 1, time: 10000, errors: ['time'] })
          .then((collected) => {
            
            let newPrefix = collected.first().content
            if (db.get(`prefix_${interaction.guild.id}`) === newPrefix) return interaction.channel.send(`Merci d'utiliser un préfix différent de votre actuelle.`)
            else {
              db.set(`prefix_${interaction.guild.id}`, collected.first().content)
              interaction.channel.send({
                embeds: [
                  new MessageEmbed()
                    .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.guild.iconURL({ dynamic: true, size: 512 }) })
                    .setDescription('Le nouveau prefix du bot Support de **Partner** est `' + `${newPrefix}` + '`.')
                    .setColor(color)
                    .setTimestamp()
                ]
              })

            }

          });
      } else {
        interaction.channel.send({ content: "Vous n'avez pas la permissions de changer le préfix !" })
      }
    }
  }});
;
///login///
client.login(token); 