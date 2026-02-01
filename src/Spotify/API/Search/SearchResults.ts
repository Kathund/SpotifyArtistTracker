import type { Constructor } from '../../../Types/Misc.js';

class SearchResults<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
  constructor(data: Record<string, any>, itemClass: Constructor<T>) {
    this.href = data.href;
    this.limit = data.limit;
    this.next = data.next;
    this.offset = data.offset;
    this.previous = data.previous;
    this.total = data.total;
    this.items = data.items.map((item: any) => new itemClass(item));
  }
}

export default SearchResults;
