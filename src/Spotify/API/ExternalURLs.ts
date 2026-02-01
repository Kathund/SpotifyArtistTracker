class ExternalURLs {
  readonly spotify: string;
  constructor(data: Record<string, any>) {
    this.spotify = data?.spotify || 'UNKNOWN';
  }
}

export default ExternalURLs;
