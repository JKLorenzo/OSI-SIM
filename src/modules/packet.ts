import type { L2, L3 } from '../utils/types.js';

export default class Packet<T = any> {
  data: T;
  L2: L2 | undefined;
  L3: L3 | undefined;

  constructor(options: { data: T; L2?: L2; L3?: L3 }) {
    this.data = options.data;
    this.L2 = options.L2;
    this.L3 = options.L3;
  }
}
