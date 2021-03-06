import { IMeme } from "./models/meme";
import { IGroup } from "./models/vkGroup";

export class Container {
  private memes: IMeme[]
  private groups: IGroup[]
  private gifs: string[]

  constructor() {
    this.memes = []
    this.groups = []
    this.gifs = []
  }

  setMemes(memes: IMeme[]) {
    this.memes = memes
  }

  getMemes() {
    return this.memes
  }

 getRandomMeme() {
    if (!this.memes) return undefined
    const meme = this.memes[Math.floor(Math.random() * this.memes.length)]
    this.memes = this.memes.filter(m => m.memeId !== meme.memeId)
    return meme
  }

  setGroups(groups: IGroup[]) {
    this.groups = groups
  }

  getGroups() {
    return this.groups
  }

  getGifs() {
    return this.gifs
  }

  setGifs(gifs: string[]) {
    this.gifs = gifs
  }

  getRandomGif() {
    return this.gifs[Math.floor(Math.random() * this.gifs.length)];
  }
}

export const container = new Container()