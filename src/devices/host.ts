import L3Device from '../modules/l3device.js';
import Packet from '../modules/packet.js';
import AddressResolutionProtocol from '../protocols/arp.js';

export default class Host extends L3Device {
  arp: AddressResolutionProtocol;

  constructor(ipAddress: string, macAddress: string) {
    super(ipAddress, macAddress);

    this.arp = new AddressResolutionProtocol(this);
  }

  handlePacket(packet: Packet): void {
    this.arp.handle(packet);

    if (packet.L3?.dstIPAddress !== this.ipAddress) return;
    if (packet.L2?.dstMACAddress !== this.macAddress) return;

    console.log(`${this.ipAddress}: Received '${packet.data}' from ${packet.L3.srcIPAddress}`);
  }

  sendPacket(packet: Packet<any>): void {
    console.log(
      `${this.ipAddress}: [Internal] Sending '${packet.data}' to ${packet.L3?.dstIPAddress}`,
    );

    this.connections.forEach(connection => connection.transmit(packet));
  }

  async send(ipAddress: string, data: any) {
    console.log(`${this.ipAddress}: Sending '${data}' to ${ipAddress}`);

    const macAddress = await this.arp.resolve(ipAddress);

    this.sendPacket(
      new Packet({
        data,
        L3: {
          srcIPAddress: this.ipAddress,
          dstIPAddress: ipAddress,
        },
        L2: {
          srcMACAddress: this.macAddress,
          dstMACAddress: macAddress,
        },
      }),
    );
  }
}
