import {Address, Chain} from "wagmi";

export type AddressMap = {
  [key: Chain['id']]: Address;
};
