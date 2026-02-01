class ExternalIds {
  isrc: string | undefined;
  ean: string | undefined;
  upc: string | undefined;
  constructor(data: Record<string, any>) {
    this.isrc = data?.isrc;
    this.ean = data?.ean;
    this.upc = data?.upc;
  }
}

export default ExternalIds;
