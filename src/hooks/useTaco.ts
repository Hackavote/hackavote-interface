import {conditions, decrypt, domains, encrypt, getPorterUri, initialize, ThresholdMessageKit} from "@nucypher/taco";
import {useCallback, useEffect, useState} from "react";
import {ethers} from "ethers";


const ritualId = 5;
const domain = domains.TESTNET;
const encryptorPrivateKey = '0x900edb9e8214b2353f82aa195e915128f419a92cfb8bbc0f4784f10ef4112b86';
const encryptorSigner = new ethers.Wallet(encryptorPrivateKey);
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai-bor.publicnode.com");

export default function useTaco() {

  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    initialize().then(() => setIsInit(true));
  }, []);

  const decryptData = useCallback(async (encryptedBytes: Uint8Array) => {
    if (!isInit) return;
    const messageKit = ThresholdMessageKit.fromBytes(encryptedBytes);
    return decrypt(
      provider,
      domain,
      messageKit,
      getPorterUri(domain)
    );
  }, [isInit]);

  const encryptDataForTime = useCallback((message: string, timestamp: number) => {
    if (!isInit) return;
    const timeCondition = new conditions.TimeCondition({
      conditionType: 'time',
      returnValueTest: {
        comparator: '>',
        value: timestamp,
      },
      method: 'blocktime',
      chain: 80001,
    });
    return encrypt(
      provider,
      domain,
      message,
      timeCondition,
      ritualId,
      encryptorSigner,
    );
  }, [isInit]);


  return {
    isInit,
    decryptData,
    encryptDataForTime
  }
}
