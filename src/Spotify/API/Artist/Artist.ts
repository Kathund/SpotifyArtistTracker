import ArtistFollowers from './ArtistFollowers.js';
import Image from '../Image.js';
import SimpleArtist from './SimpleArtist.js';
import type Embed from '../../../Discord/Private/Embed.js';

class Artist extends SimpleArtist {
  followers: ArtistFollowers;
  genres: string[];
  images: Image[];
  popularity: number;
  constructor(data: Record<string, any>) {
    super(data);
    this.followers = new ArtistFollowers(data.followers);
    this.genres = data.genres;
    this.images = data.images.map((image: Record<string, any>) => new Image(image));
    this.popularity = data.popularity;
  }

  override toEmbed(): Embed {
    return super.toEmbed().setAuthor({
      name: this.toString(),
      iconURL: this.images[0]?.url,
      url: this.externalURLs.spotify
    });
  }
}

export default Artist;
