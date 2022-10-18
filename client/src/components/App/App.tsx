import Web3 from 'web3';
import { FC, useEffect, useState } from 'react';
import { HomePage } from '../../pages/HomePage/HomePage';

export const App: FC = () => {
  const [account, setAccount] = useState<string>();

  const load = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    // const networkID = await web3.eth.net.getId();

    setAccount(accounts[0]);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    console.log(account);
  }, [account]);

  return (
    <HomePage />
  );
};
