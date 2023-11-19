import {gnosis} from "wagmi/chains";
import {AddressMap} from "types";
import {Address} from "viem";

export const HACKAVOTE_PROJECTS_CONTRACT_ADDRESS_MAP: AddressMap = {
  [gnosis.id]: (process.env.REACT_APP_HACKAVOTE_PROJECTS_CONTRACT_ADDRESS as Address | undefined) || '0x2aBD91e1c130c54996Df39854D3c3cf357636f5A'
}
export const HACKAVOTE_CONTRACT_ADDRESS_MAP: AddressMap = {
  [gnosis.id]: (process.env.REACT_APP_HACKAVOTE_CONTRACT_ADDRESS as Address | undefined) || '0x40E1EA4B9d149CAEf0C239A49E967EeB13681749'
}
