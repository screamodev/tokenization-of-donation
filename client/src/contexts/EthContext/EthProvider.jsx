import React, {
  useReducer, useCallback, useEffect,
} from 'react';
import Web3 from 'web3';
import { reducer, actions, initialState } from './state';
import EthContext from './EthContext';

const CrowdfundingPlatform = require('../../contracts/CrowdfundingPlatform.json');
// const CampaignContract = require('../../contracts/Campaign.json');

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    if (CrowdfundingPlatform) {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      // const networkID = await web3.eth.net.getId();
      // const { abi } = CrowdfundingPlatform;
      // let address; let
      //   contract;
      // try {
      //   address = CrowdfundingPlatform.networks[networkID].address;
      //   contract = new web3.eth.Contract(abi, address);
      // } catch (err) {
      //   console.error(err);
      // }
      dispatch({
        type: actions.init,
        data: { userAccount: accounts[0] },
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: actions.init,
      data: { isMetamaskInstalled: !!window.ethereum },
    });
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const events = ['chainChanged', 'accountsChanged'];
      const handleChange = () => {
        init();
      };

      events.forEach((e) => window.ethereum.on(e, handleChange));
      return () => {
        events.forEach((e) => window.ethereum.removeListener(e, handleChange));
      };
    }
  }, [init, CrowdfundingPlatform]);

  const connectWallet = () => {
    init();
  };

  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      connectWallet,
    }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
