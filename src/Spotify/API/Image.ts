class Image {
  url: string;
  width: number | null;
  height: number | null;
  pixels: number | null;
  constructor(data: Record<string, any>) {
    this.url = data.url;
    this.width = data.width;
    this.height = data.height;
    this.pixels = this.width !== null && this.height !== null ? this.width * this.height : null;
  }

  toString(): string | null {
    return this.url;
  }
}

export default Image;
