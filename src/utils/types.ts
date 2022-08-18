export type IPAddress = string;

export type MACAddress = string;

export type L2 = {
  srcMACAddress: MACAddress;
  dstMACAddress: MACAddress | undefined;
};

export type L3 = {
  srcIPAddress: IPAddress | undefined;
  dstIPAddress: IPAddress;
};
