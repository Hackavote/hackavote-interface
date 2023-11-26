import {fromBytes, toHexString,} from '@nucypher/taco';
import {useState} from 'react';
import useTaco from "hooks/useTaco";
import {fromHexString} from "@nucypher/shared";

const message = 'this is a secret';

function Taco() {
  const [decryptedMessage, setDecryptedMessage] = useState<string | undefined>(
    '',
  );

  const [encryptedText, setEncryptedText] = useState<string | null>(null)

  const {isInit, encryptDataForTime, decryptDataToBytes} = useTaco()
  const runExample = async () => {
    if (!isInit) return
    setEncryptedText(null)
    setDecryptedMessage('')
    const messageKit = await encryptDataForTime(message, Math.floor(+new Date() / 1000) + 20);
    if (messageKit) {
      setEncryptedText(toHexString(messageKit.toBytes()))
    }
  };

  // const hackavoteContractAddress = useContractAddress(HACKAVOTE_CONTRACT_ADDRESS_MAP)
  // const {data: opinions} = useHackavoteGetOpinionsOfHacker({
  //   address: hackavoteContractAddress,
  //   args: ['0x7f96cE96b4E7e1F8AcCDFFFF1919513599a15B6E']
  // })
  //
  // useEffect(() => {
  //   if (opinions?.[0]) {
  //     decryptDataToBytes(fromHexString(opinions[0])).then(data => {
  //       if (data) {
  //         setDecryptedMessage(fromBytes(data))
  //       }
  //     }).catch(e => alert(String(e)))
  //   }
  // }, [decryptDataToBytes, opinions]);

  if (!isInit) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Secret message: {message}</h1>
      {encryptedText && <h1>Encrypted text: {encryptedText}</h1>}
      {decryptedMessage && <h1>Decrypted message: {decryptedMessage}</h1>}
      <button onClick={runExample}>Run example</button>
      <br/>
      {encryptedText && <button
          onClick={() => decryptDataToBytes(fromHexString(encryptedText)).then(data => {
            if (data) {
              setDecryptedMessage(fromBytes(data))
            }
          }).catch(e => alert(String(e)))}>Decrypt</button>}
    </div>
  );
}

export default Taco;
