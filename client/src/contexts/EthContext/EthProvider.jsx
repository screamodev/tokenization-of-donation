import React, {
  useReducer, useCallback, useEffect,
} from 'react';
import Web3 from 'web3';
import { reducer, actions, initialState } from './state';
import EthContext from './EthContext';
import { filterCampaignInstance, getCampaignsAddresses } from './helpers/helpers';

const CrowdfundingPlatform = require('../../contracts/CrowdfundingPlatform.json');
const CampaignContract = require('../../contracts/Campaign.json');

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // create init adter refresh page
  const init = useCallback(async () => {
    if (CrowdfundingPlatform && CampaignContract) {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();

      const { abi } = CrowdfundingPlatform;
      const { abi: campaignAbi } = CampaignContract;

      const { address } = CrowdfundingPlatform.networks[networkID];

      const crowdfundingPlatformInstance = new web3.eth.Contract(abi, address);

      const campaignsCount = await crowdfundingPlatformInstance
        .methods.campaignsCount().call();

      console.log(campaignsCount);

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
          ));

        const campaignsPromisses = await Promise.all(campaignsPending);

        return campaignsPromisses;
      }());

      console.log(campaigns);

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
        data: {
          web3,
          campaignAbi,
          userAccount: accounts[0],
          crowdfundingPlatformInstance,
          campaigns,
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
