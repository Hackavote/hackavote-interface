import {
  conditions,
  decrypt,
  domains,
  encrypt,
  fromBytes,
  getPorterUri,
  initialize,
  ThresholdMessageKit,
  toHexString,
} from '@nucypher/taco';
import {ethers} from 'ethers';
import {useEffect, useState} from 'react';
import {fromHexString} from "@nucypher/shared";

const message = 'this is a secret';

function Home() {
  const [isInit, setIsInit] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>(
    '',
  );

  const initNucypher = async () => {
    console.log('init start')
    await initialize();
    console.log('init end')
    setIsInit(true);
  };

  useEffect(() => {
    initNucypher();
  }, []);


  const [encryptedText, setEncryptedText] = useState<string | null>(null)

  const ritualId = 5;
  const domain = domains.TESTNET;
  const encryptorPrivateKey = '0x900edb9e8214b2353f82aa195e915128f419a92cfb8bbc0f4784f10ef4112b86';
  const encryptorSigner = new ethers.Wallet(encryptorPrivateKey);
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai-bor.publicnode.com");


  async function decryptData(encryptedTextParam: string) {
    if (!isInit) return;
    const messageKit = ThresholdMessageKit.fromBytes(fromHexString(encryptedTextParam));
    console.log('Decrypting message...');
    const decryptedMessage = await decrypt(
      provider,
      domain,
      messageKit,
      getPorterUri(domain)
    );
    setDecryptedMessage(fromBytes(decryptedMessage));
  }

  async function encryptData() {
    console.log('Encrypting message...');
    const timeCondition = new conditions.TimeCondition({
      conditionType: 'time',
      returnValueTest: {
        comparator: '>',
        value: 100,
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
  }

  const runExample = async () => {
    if (!isInit) return
    setEncryptedText(null)
    setDecryptedMessage('')
    const messageKit = await encryptData();
    const encryptedText = toHexString(messageKit.toBytes())
    setEncryptedText(encryptedText)
    await decryptData(encryptedText);
  };

  if (!isInit || !provider) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Secret message: {message}</h1>
      {encryptedText && <h1>Encrypted text: {encryptedText}</h1>}
      {decryptedMessage && <h1>Decrypted message: {decryptedMessage}</h1>}
      <button onClick={runExample}>Run example</button>
    </div>
  );
}

export default Home;
