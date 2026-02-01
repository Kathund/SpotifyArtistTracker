export interface Token {
  key: string;
  refresh: string;
  type: string;
  expiresIn: number;
  expirationTime: number;
  scope: string[];
}

export type AlbumType = 'album' | 'single' | 'compilation';
export type AlbumGroup = AlbumType | 'appears_on';
export type AlbumReleaseDatePrecision = 'year' | 'month' | 'day';
export type RestrictionsReason = 'market' | 'product' | 'explicit';
