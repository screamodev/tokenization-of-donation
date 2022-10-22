export const getCampaignsAddresses = async (contractInstance, campaignsCount) => {
  const campaignsAddressesPending = [];

  for (let i = 1; i <= campaignsCount; i++) {
    campaignsAddressesPending.push(contractInstance
      .methods.campaigns(i).call());
  }
  const campaignsAddressesPromisses = await Promise.all(campaignsAddressesPending);

  return campaignsAddressesPromisses;
};

export const filterCampaignInstance = async (web3, abi, address) => {
  const { methods: campaignMethods } = new web3
    .eth.Contract(abi, address);

  return {
    id: await campaignMethods.id().call(),
    title: await campaignMethods.title().call(),
    description: await campaignMethods.description().call(),
    goal: web3.utils.fromWei(await campaignMethods.goal().call(), 'ether'),
    alreadyDonated: web3.utils.fromWei(await campaignMethods.alreadyDonated().call(), 'ether'),
    endsAt: await campaignMethods.endsAt().call(),
    organizer: await campaignMethods.organizer().call(),
  };
};
