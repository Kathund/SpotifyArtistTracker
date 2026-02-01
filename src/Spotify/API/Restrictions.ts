import type { RestrictionsReason } from '../../Types/Spotify.js';

class Restrictions {
  reason: RestrictionsReason;
  constructor(data: Record<string, any>) {
    this.reason = data?.reason || 'market';
  }

  toString(): RestrictionsReason {
    return this.reason;
  }
}

export default Restrictions;
