import type { IPAddress } from '../utils/types.js';
import L2Device from './l2device.js';

export default abstract class L3Device extends L2Device {
  ipAddress: string;

  constructor(ipAddress: string, macAddress: string) {
    super(macAddress);

    this.ipAddress = ipAddress;
  }

  // eslint-disable-next-line no-unused-vars
  abstract send(ipAddress: IPAddress, data: any): void;
}
