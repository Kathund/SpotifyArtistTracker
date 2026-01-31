class SpotifyArtistTrackerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Spotify Artist Tracker';
  }

  override toString(): string {
    return this.message;
  }
}
export default SpotifyArtistTrackerError;
