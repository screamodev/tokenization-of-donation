import React, {
  useReducer, useCallback, useEffect,
} from 'react';
import Web3 from 'web3';
import { reducer, actions, initialState } from './state';
import EthContext from './EthContext';
import {
  filterCampaignInstance,
  filterNftInstance,
  getCampaignsAddresses,
  getNftsAddresses,
} from './helpers/helpers';

const CrowdfundingPlatform = require('../../contracts/CrowdfundingPlatform.json');
const CampaignContract = require('../../contracts/Campaign.json');
const NftReward = require('../../contracts/NftReward.json');

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    if (CrowdfundingPlatform && CampaignContract && NftReward) {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();

      const { abi } = CrowdfundingPlatform;
      const { abi: campaignAbi } = CampaignContract;
      const { abi: nftRewardAbi } = NftReward;

      const { address } = CrowdfundingPlatform.networks[networkID];

      console.log(address, 'this');

      const crowdfundingPlatformInstance = new web3.eth.Contract(abi, address);

      const campaignsCount = await crowdfundingPlatformInstance
        .methods.campaignsCount().call();

      const userNftCount = await crowdfundingPlatformInstance
        .methods.usersNftCounts(accounts[0]).call();

      const { userNfts, userNftAddresses } = await (async function () {
        if (!userNftCount) {
          return [];
        }

        const nftsAdresses = await getNftsAddresses(
          crowdfundingPlatformInstance,
          accounts[0],
          userNftCount,
        );

        const nftsPending = nftsAdresses
          .map((nftAddress) => filterNftInstance(
            web3,
            nftRewardAbi,
            nftAddress,
          ));

        const nftsPromisses = await Promise.all(nftsPending);

        return { userNfts: nftsPromisses, userNftAddresses: nftsAdresses };
      }());

      console.log(userNfts);

      const campaigns = await (async function () {
        if (!campaignsCount) {
          return [];
        }

        const campaignsAddresses = await getCampaignsAddresses(
          crowdfundingPlatformInstance,
          campaignsCount,
        );

        const campaignsPending = campaignsAddresses
          .map((campaign) => filterCampaignInstance(
            web3,
            campaignAbi,
            campaign.targetContract,
            accounts[0],
          ));

        const campaignsPromisses = await Promise.all(campaignsPending);

        return campaignsPromisses;
      }());

      console.log(campaigns);

      dispatch({
        type: actions.init,
        data: {
          web3,
          campaignAbi,
          nftRewardAbi,
          isLoading: false,
          userAccount: accounts[0],
          crowdfundingPlatformInstance,
          campaigns,
          userNfts,
          userNftAddresses,
        },
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
      isConnected();
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

  const isConnected = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      init();
    }
  };

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
