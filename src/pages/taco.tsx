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

  const {isInit, encryptDataForTime, decryptData} = useTaco()
  const runExample = async () => {
    if (!isInit) return
    setEncryptedText(null)
    setDecryptedMessage('')
    const messageKit = await encryptDataForTime(message, Math.floor(+new Date() / 1000) + 20);
    if (messageKit) {
      setEncryptedText(toHexString(messageKit.toBytes()))
    }
  };

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
          onClick={() => decryptData(fromHexString(encryptedText)).then(data => {
            if (data) {
              setDecryptedMessage(fromBytes(data))
            }
          }).catch(e => alert(String(e)))}>Decrypt</button>}
    </div>
  );
}

export default Taco;
