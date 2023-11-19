import {Address, Chain} from "viem";

export type AddressMap = {
  [key: Chain['id']]: Address
}

export type HackathonProject = {
  index: number;
  author: Address;
  submissionInfoSlug: string;
  socialMediaUrl: string;
  donationAddress: Address;
}
