import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    pocketNetwork: any
  }
}

enum poktMessageType {
  REQUEST_ACCOUNTS = 'pokt_requestAccounts',
  PUBLIC_KEY = 'pokt_publicKey',
  BALANCE = 'pokt_balance',
  SEND_TRANSACTION = 'pokt_sendTransaction',
  STAKE_NODE = 'pokt_stakeNode',
  SIGN_MESSAGE = 'pokt_signMessage',
  TX = 'pokt_tx',
  HEIGHT = 'pokt_height',
  BLOCK = 'pokt_block',
  CHAIN = 'pokt_chain',
}

const handleError = (err: any) => {
  console.error(err);
  alert(`Error:\n\n${err.message}`);
};

interface ConnectComponentProps {
  onConnectClick: (e: React.MouseEvent) => void;
}
const ConnectComponent = ({ onConnectClick }: ConnectComponentProps) => {
  return (
    <div>
      <p>Wallet is available! Click the button below to connect.</p>
      <button onClick={onConnectClick}>Connect to wallet!</button>
    </div>
  );
};
interface WalletComponentProps {
  address: string;
}
const WalletComponent = ({ address }: WalletComponentProps) => {

  const [ publicKey, setPublicKey ] = useState<string>('');
  const [ balance, setBalance ] = useState<number>(0);
  const [ height, setHeight ] = useState(0);
  const [ txid, setTxid ] = useState<string>('');
  const [ transaction, setTransaction ] = useState<any>(null);
  const [ txRecipient, setTxRecipient ] = useState<string>('');
  const [ txAmount, setTxAmount ] = useState<string>('');
  const [ txMemo, setTxMemo ] = useState<string>('');
  const [ chain, setChain ] = useState<string>('');
  const [ signingPayload, setSigningPayload ] = useState<string>('');
  const [ signature, setSignature ] = useState<string>('');
  const [ stakeAmount, setStakeAmount ] = useState<string>('');
  const [ stakeServiceUrl, setStakeServiceUrl ] = useState<string>('');
  const [ stakeChains, setStakeChains ] = useState<string>('');
  const [ stakeOperatorPublicKey, setStakeOperatorPublicKey ] = useState<string>('');

  useEffect(() => {

    window.pocketNetwork.send(poktMessageType.PUBLIC_KEY, [{address}])
      .then((res: { publicKey: string }) => {
        setPublicKey(res?.publicKey ? res.publicKey : '');
      })
      .catch((err: any) => {
        console.error(err);
      });

    window.pocketNetwork.send(poktMessageType.CHAIN)
      .then((res: { chain: string }) => {
        setChain(res?.chain ? res.chain : '');
      })
      .catch((err: any) => {
        console.error(err);
      });

    window.pocketNetwork.send(poktMessageType.HEIGHT)
      .then((res: { height: number }) => {
        setHeight(res?.height ? res.height : 0);
      })
      .catch((err: any) => {
        handleError(err);
      });

    window.pocketNetwork.send(poktMessageType.BALANCE, [{address}])
      .then((res: { balance: number }) => {
        setBalance(res?.balance ? res.balance : 0);
      })
      .catch((err: any) => {
        handleError(err);
      });

  }, [address]);

  const onTxRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTxRecipient(e.target.value);
  };
  const onTxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTxAmount(e.target.value);
  };
  const onTxMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTxMemo(e.target.value);
  };
  const onSendTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.pocketNetwork.send(poktMessageType.SEND_TRANSACTION, [{
      amount: txAmount,
      from: address,
      to: txRecipient,
      memo: txMemo,
    }])
      .then((res: {hash: string}) => {
        alert(`Transaction sent with hash:\n\n${res.hash}`);
        setTxRecipient('');
        setTxAmount('');
        setTxMemo('');
      })
      .catch((err: any) => {
        handleError(err);
      });
  };

  const onSigningPayloadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSigningPayload(e.target.value);
  };
  const onSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.pocketNetwork.send(poktMessageType.SIGN_MESSAGE, [{message: signingPayload, address}])
      .then((res: {signature: string}) => {
        setSignature(res.signature);
      })
      .catch((err: any) => {
        handleError(err);
      });
  };

  const onTxidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTxid(e.target.value);
  };
  const onGetTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.pocketNetwork.send(poktMessageType.TX, [{hash: txid}])
      .then((transaction: any) => {
        setTransaction(transaction);
      })
      .catch((err: any) => {
        handleError(err);
      });
  };

  const onStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStakeAmount(e.target.value);
  };
  const onStakeServiceUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStakeServiceUrl(e.target.value);
  };
  const onStakeChainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setStakeChains(e.target.value);
  };
  const onStakeOperatorPublicKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setStakeOperatorPublicKey(e.target.value);
  };
  const onStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.pocketNetwork.send(poktMessageType.STAKE_NODE, [{
      amount: stakeAmount,
      chains: stakeChains.split(','),
      address,
      operatorPublicKey: stakeOperatorPublicKey,
      serviceURL: stakeServiceUrl,
    }])
      .then((res: {hash: string}) => {
        alert(`Stake transaction sent with hash:\n\n${res.hash}`);
        setStakeAmount('');
        setStakeServiceUrl('');
        setStakeChains('');
        setStakeOperatorPublicKey('');
      })
      .catch((err: any) => {
        handleError(err);
      });
  };

  return (
    <div>
      <div>
        Pocket Network Chain: <strong>{chain}</strong>
      </div>
      <div>
        Pocket Network Height: <strong>{height ? height : ''}</strong>
      </div>
      <div>
        POKT Account: <strong>{address}</strong>
      </div>
      <div>
        Account Balance: <strong>{balance} uPOKT</strong>
      </div>
      <div>
        Public Key: <strong>{publicKey}</strong>
      </div>

      <div>
        <h2>Send Transaction</h2>
        <form onSubmit={onSendTransactionSubmit}>
          <div>
            <label>Recipient Address:</label>
            <input type="text" placeholder="Enter recipient address" value={txRecipient}
                   onChange={onTxRecipientChange}/>
          </div>
          <div>
            <label>Amount in uPOKT:</label>
            <input type="number" placeholder="Enter amount" value={txAmount} onChange={onTxAmountChange}/>
          </div>
          <div>
            <label>Memo (optional):</label>
            <input type="text" placeholder="Enter memo" value={txMemo} onChange={onTxMemoChange}/>
          </div>
          <button type="submit">Send Transaction</button>
        </form>
      </div>

      <div>
        <h2>Sign Message</h2>
        <form onSubmit={onSignSubmit}>
          <div>
            <label>Message:</label>
            <input type="text" placeholder="Message to sign" value={signingPayload} onChange={onSigningPayloadChange}/>
          </div>
          <button type="submit">Sign Message</button>
        </form>
        {signature ?
          <div style={styles.signatureContainer as React.CSSProperties}>{signature}</div>
          :
          null
        }
      </div>

      <div>
        <h2>Get Transaction</h2>
        <form onSubmit={onGetTransactionSubmit}>
          <div>
            <label>Transaction Hash:</label>
            <input type="text" placeholder="Transaction Hash" value={txid} onChange={onTxidChange}/>
          </div>
          <button type="submit">Get Transaction</button>
        </form>
        {transaction ?
          <div style={styles.txContainer as React.CSSProperties}>{JSON.stringify(transaction, null, '  ')}</div>
          :
          null
        }
      </div>

      <div>
        <h2>Stake Node</h2>
        <form onSubmit={onStakeSubmit}>
          <div>
            <label>Amount in uPOKT:</label>
            <input type="number" placeholder="Enter amount to stake" value={stakeAmount}
                   onChange={onStakeAmountChange}/>
          </div>
          <div>
            <label>Service URL:</label>
            <input type="text" placeholder="Enter service URL" value={stakeServiceUrl}
                   onChange={onStakeServiceUrlChange}/>
          </div>
          <div>
            <label>Chains:</label>
            <input type="text" placeholder="Enter chains, separated by comma" value={stakeChains}
                   onChange={onStakeChainsChange}/>
          </div>
          <div>
            <label>Operator Public Key:</label>
            <textarea rows={3} style={styles.textarea as React.CSSProperties} placeholder="Enter operator public key"
                      value={stakeOperatorPublicKey} onChange={onStakeOperatorPublicKeyChange}/>
          </div>
          <button type="submit">Stake Node</button>
        </form>
      </div>

    </div>
  );
};

export const App = () => {

  const [walletAvailable, setWalletAvailable ] = useState<boolean|null>(null);
  const [ address, setAddress ] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setWalletAvailable(!!window.pocketNetwork);
    }, 100);
  }, []);

  const onConnectClick = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      const [ address ]: [string] = await window.pocketNetwork.send(poktMessageType.REQUEST_ACCOUNTS);
      setAddress(address);
    } catch(err: any) {
      handleError(err);
    }
  };

  return (
    <div>
      <h1>POKT Web Integration Tester</h1>
      {typeof walletAvailable !== 'boolean' ?
        null
        :
        !walletAvailable ?
          <div>Wallet is not available.</div>
          :
          !address ?
            <ConnectComponent onConnectClick={onConnectClick} />
            :
            <WalletComponent address={address} />
      }
    </div>
  );
}

const styles = {
  signatureContainer: {
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
  },
  txContainer: {
    fontFamily: 'monospace',
    whiteSpace: 'pre',
  },
  textarea: {
    resize: 'vertical',
  },
};
