import type Packet from './packet.js';
import type Cable from './cable.js';

export default abstract class L1Device {
  connections: Cable[];

  constructor() {
    this.connections = [];
  }

  connect(cable: Cable) {
    this.connections.push(cable);
    cable.connect(this);
  }

  disconnect(cable: Cable) {
    if (!this.connections.includes(cable)) return;
    this.connections.splice(this.connections.indexOf(cable), 1);
    cable.disconnect(this);
  }

  // eslint-disable-next-line no-unused-vars
  abstract handlePacket(packet: Packet): void;

  // eslint-disable-next-line no-unused-vars
  abstract sendPacket(packet: Packet): void;
}
