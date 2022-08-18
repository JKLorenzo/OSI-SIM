import L1Device from "../modules/l1device";
import type Packet from "../modules/packet";
import type { MACAddress } from "../utils/types";

export default class Switch extends L1Device {
  private cache: Map<MACAddress, number>;

  constructor() {
    super();
    this.cache = new Map();
  }
  
  handlePacket(packet: Packet<any>): void {
    this.sendPacket(packet);
  }

  sendPacket(packet: Packet<any>): void {
    const dstMACAddress = packet.L2?.dstMACAddress;
    if (!dstMACAddress) return;

    const port = this.cache.get(dstMACAddress);
    
    if (port && this.connections[port]) {
      this.connections[port]!.transmit(packet);
    } else {
      // flood
      this.connections.forEach(connection => connection.transmit(packet));
    }
  }
}