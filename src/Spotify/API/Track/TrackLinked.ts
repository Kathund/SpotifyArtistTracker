import ExternalURLs from '../ExternalURLs.js';

class TrackLinked {
  externalURLs: ExternalURLs | undefined;
  href: string | undefined;
  id: string | undefined;
  type: 'track' | undefined;
  uri: string | undefined;
  constructor(data: Record<string, any>) {
    this.externalURLs = data?.external_urls !== undefined ? new ExternalURLs(data.external_urls) : undefined;
    this.href = data?.href;
    this.id = data?.id;
    this.type = data?.type;
    this.uri = data?.uri;
  }
}

export default TrackLinked;
