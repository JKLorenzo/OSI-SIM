import { EventEmitter } from 'events';
import type Device from './l1device.js';
import type Packet from './packet.js';

export default class Cable {
  private emitter: EventEmitter;
  private devices: Device[];

  constructor() {
    this.emitter = new EventEmitter();
    this.devices = [];
    this.emitter.on('tx', packet => this.devices.forEach(device => device.handlePacket(packet)));
  }

  connect(device: Device) {
    this.devices.push(device);
  }

  disconnect(device: Device) {
    if (!this.devices.includes(device)) return;
    this.devices.splice(this.devices.indexOf(device), 1);
  }

  transmit(packet: Packet) {
    this.emitter.emit('tx', packet);
  }
}
