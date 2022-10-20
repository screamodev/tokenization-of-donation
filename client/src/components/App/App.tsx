import { FC } from 'react';
import { HomePage } from '../../pages/HomePage/HomePage';
import { EthProvider } from '../../contexts/EthContext';

export const App: FC = () => {
  console.log(1);
  // const [account, setAccount] = useState<string>();
  // const [walletError, setWalletError] = useState<string>();

  // const load = async () => {
  //   if (!window.ethereum) {
  //     setWalletError('Metamask installed metamask in your browser.');
  //   }
  //   const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
  //   const accounts = await web3.eth.requestAccounts();
  //   // const networkID = await web3.eth.net.getId();
  //
  //   setAccount(accounts[0]);
  // };
  //
  // useEffect(() => {
  //   load();
  // }, []);

  // useEffect(() => {
  //   console.log(account);
  // }, [account]);

  return (
    <EthProvider>
      <HomePage />
    </EthProvider>
  );
};
