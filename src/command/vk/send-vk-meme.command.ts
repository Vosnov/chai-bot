import Discord from 'discord.js'
import {IMeme} from "../../models/meme";
import Command, { ICommand } from '../command';
import { VkService } from '../../services/vk.service';
import { Container } from '../../container';

export class SendVkMemeCommand extends Command implements ICommand {
  commandNames = ['meme', 'mem', 'm'];
  description = 'Отправить мем'

  vkService = new VkService()
  container = new Container()

  private getRandomMeme() {
    const memes = this.container.getMemes()
    if (!memes) return undefined
    return memes[Math.floor(Math.random() * memes.length)]
  }

  async run(msg: Discord.Message): Promise<void> {
    const memes = this.container.getMemes()

    if (!this.container.getGroups().length && memes.length <= 0) await this.loadDefaultMemes()
    if (this.container.getMemes().length <= 0) await this.loadMemes()

    const meme = this.getRandomMeme();
    if (meme) {
      this.sendMessage(meme, msg)
    } else {
      this.sendDefaultMessage('Мемы закончились :( Попробуйте в другой раз', this.color, msg)
    }
  }

  private sendMessage(meme: IMeme, msg: Discord.Message) {
    if (meme.urls.length === 1) {
      const embed = new Discord.MessageEmbed()
        .setDescription(meme.text)
        .setImage(meme.urls[0])
        .setColor(this.color)
      
      msg.channel.send(embed)
    } else {
      msg.channel.send(meme?.text, {files: meme.urls})
    }
  }

  private async loadDefaultMemes() {
    const walls = await this.vkService.getDefaultGroupWalls()
    const memes: IMeme[] = []
    walls.forEach(wall => {
      if (wall) memes.push(...wall.memes)
    })

    this.container.setMemes(memes)
  }

  private async loadMemes() {
    const groups = this.container.getGroups()
    const walls = await this.vkService.getAllMemes(groups)
    const memes: IMeme[] = [] 
    walls.forEach(wall => {
      if (!wall) return

      memes.push(...wall.memes)

      const userGroup = groups.find(group => group.groupId === wall.groupId)

      if (userGroup) {
        userGroup.postCount = wall.count
      }
    })

    this.container.setMemes(memes);
  }
}