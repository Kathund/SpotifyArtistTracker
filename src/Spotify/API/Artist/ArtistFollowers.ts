class ArtistFollowers {
  href: string | null;
  total: number;
  constructor(data: Record<string, any>) {
    this.href = data.href;
    this.total = data.total;
  }
}

export default ArtistFollowers;
