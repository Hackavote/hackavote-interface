import {conditions, decrypt, domains, encrypt, fromBytes, getPorterUri, initialize,} from '@nucypher/taco';
import {ethers} from 'ethers';
import {useEffect, useState} from 'react';

declare const window: any;

const message = 'this is a secret';

function Home() {
  const [isInit, setIsInit] = useState(false);
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>(
    '',
  );

  const initNucypher = async () => {
    await initialize();
    setIsInit(true);
  };

  const loadWeb3Provider = async () => {
    if (!window.ethereum) {
      console.error('You need to connect to your wallet first');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');


    await provider.send('eth_requestAccounts', []);
    setProvider(provider);
  };

  useEffect(() => {
    initNucypher();
    loadWeb3Provider();
  }, []);

  if (!isInit || !provider) {
    return <div>Loading...</div>;
  }

  const runExample = async () => {
    await initialize();
    const ritualId = 5;
    const domain = domains.TESTNET;
    const encryptorPrivateKey = '0x900edb9e8214b2353f82aa195e915128f419a92cfb8bbc0f4784f10ef4112b86';
    const encryptorSigner = new ethers.Wallet(encryptorPrivateKey);

    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai-bor.publicnode.com");

    console.log('Encrypting message...');
    const hasPositiveBalance = new conditions.TimeCondition({
      conditionType: 'time',
      returnValueTest: {
        comparator: '>',
        value: 100,
      },
      method: 'blocktime',
      chain: 80001,
    });
    console.log('Encrypting message...2');
    const messageKit = await encrypt(
      provider,
      domain,
      message,
      hasPositiveBalance,
      ritualId,
      encryptorSigner,
    );

    console.log('Decrypting message...');
    const decryptedMessage = await decrypt(
      provider,
      domain,
      messageKit,
      getPorterUri(domain)
    );

    setDecryptedMessage(fromBytes(decryptedMessage));
  };

  return (
    <div>
      <h1>Secret message: {message}</h1>
      {decryptedMessage && <h1>Decrypted message: {decryptedMessage}</h1>}
      <button onClick={runExample}>Run example</button>
    </div>
  );
}

export default Home;
