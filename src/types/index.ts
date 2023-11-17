import {Address, Chain} from "viem";

export type AddressMap = {
  [key: Chain['id']]: Address
}
