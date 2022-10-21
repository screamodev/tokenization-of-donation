const actions = {
  init: 'INIT',
  addCampaign: 'ADD_CAMPAIGN',
};

const initialState = {
  web3: null,
  campaignAbi: null,
  isMetamaskInstalled: false,
  userAccount: null,
  crowdfundingPlatformInstance: null,
  campaigns: [],
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };

    case actions.addCampaign:
      return { ...state, campaigns: [...state.campaigns, data] };
    default:
      throw new Error('Undefined reducer action type');
  }
};

export {
  actions,
  initialState,
  reducer,
};
