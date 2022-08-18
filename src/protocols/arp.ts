import EventEmitter from 'events';
import type L3Device from '../modules/l3device.js';
import Packet from '../modules/packet.js';
import type { IPAddress, MACAddress } from '../utils/types.js';

const ARPRequest = 'ARP_REQUEST';
const ARPResponse = 'ARP_RESPONSE';
const BroadcastAddress = 'ff:ff:ff:ff:ff:ff';

export default class AddressResolutionProtocol {
  private cache: Map<IPAddress, MACAddress>;
  private device: L3Device;
  private emitter: EventEmitter;

  constructor(device: L3Device) {
    this.cache = new Map();
    this.device = device;
    this.emitter = new EventEmitter();
  }

  handle(packet: Packet) {
    const srcIpAddress = packet.L3?.srcIPAddress;
    const srcMacAddress = packet.L2?.srcMACAddress;
    const dstIpAddress = packet.L3?.dstIPAddress;
    const dstMacAddress = packet.L2?.dstMACAddress;

    if (!srcIpAddress || !srcMacAddress) return;
    if (dstIpAddress !== this.device.ipAddress) return;

    const isArpRequest = dstMacAddress === BroadcastAddress && packet.data === ARPRequest;

    if (dstMacAddress !== this.device.macAddress && !isArpRequest) return;

    console.log(
      `${this.device.ipAddress}: [ARP] Updating ${srcIpAddress}'s MAC Address to ${srcMacAddress}`,
    );

    this.cache.set(srcIpAddress, srcMacAddress);

    if (isArpRequest) this.respond(srcIpAddress, srcMacAddress);

    this.emitter.emit(srcIpAddress, srcMacAddress);
  }

  resolve(ipAddress: IPAddress): Promise<MACAddress> {
    return new Promise(resolve => {
      const macAddress = this.cache.get(ipAddress);
      if (macAddress) {
        console.log(`${this.device.ipAddress}: [ARP] MAC Address of ${ipAddress} is ${macAddress}`);
        resolve(macAddress);
      } else {
        this.emitter.once(ipAddress, resolve);
        this.request(ipAddress);
      }
    });
  }

  private request(ipAddress: IPAddress) {
    console.log(
      `${this.device.ipAddress}: [ARP] MAC Address of ${ipAddress} is unknown, sending request`,
    );

    this.device.sendPacket(
      new Packet({
        data: ARPRequest,
        L3: {
          srcIPAddress: this.device.ipAddress,
          dstIPAddress: ipAddress,
        },
        L2: {
          srcMACAddress: this.device.macAddress,
          dstMACAddress: BroadcastAddress,
        },
      }),
    );
  }

  private respond(ipAddress: IPAddress, macAddress: MACAddress) {
    console.log(`${this.device.ipAddress}: [ARP] Responding to ${ipAddress}'s ARP Request`);

    this.device.sendPacket(
      new Packet({
        data: ARPResponse,
        L3: {
          srcIPAddress: this.device.ipAddress,
          dstIPAddress: ipAddress,
        },
        L2: {
          srcMACAddress: this.device.macAddress,
          dstMACAddress: macAddress,
        },
      }),
    );
  }
}
