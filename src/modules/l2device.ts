import L1Device from './l1device.js';

export default abstract class L2Device extends L1Device {
  macAddress: string;

  constructor(macAddress: string) {
    super();
    this.macAddress = macAddress;
  }
}
