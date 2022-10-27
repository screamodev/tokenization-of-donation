export const getCampaignsAddresses = async (contractInstance, campaignsCount) => {
  const campaignsAddressesPending = [];

  for (let i = 1; i <= campaignsCount; i++) {
    campaignsAddressesPending.push(contractInstance
      .methods.campaigns(i).call());
  }
  const campaignsAddressesPromisses = await Promise.all(campaignsAddressesPending);

  return campaignsAddressesPromisses;
};

export const filterCampaignInstance = async (web3, abi, contractAddress, userAccount) => {
  const { methods: campaignMethods } = new web3
    .eth.Contract(abi, contractAddress);

  return {
    id: +await campaignMethods.id().call(),
    title: await campaignMethods.title().call(),
    description: await campaignMethods.description().call(),
    goal: +web3.utils.fromWei(await campaignMethods.goal().call(), 'ether'),
    alreadyDonated: +web3.utils.fromWei(await campaignMethods.alreadyDonated().call(), 'ether'),
    endsAt: +await campaignMethods.endsAt().call(),
    organizer: await campaignMethods.organizer().call(),
    claimed: await campaignMethods.claimed().call(),
    currentUserDonations: +web3.utils.fromWei(await campaignMethods.donations(userAccount).call(), 'ether'),
    donate: await campaignMethods.donate,
    refundDonation: await campaignMethods.refundDonation,
    claim: await campaignMethods.claim,
  };
};
