import CacheHandler from './Private/CacheHandler.js';
class Application {
  readonly cacheHandler: CacheHandler;
  constructor() {
    this.cacheHandler = new CacheHandler();
export default Application;
