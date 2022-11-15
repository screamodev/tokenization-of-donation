export const getCampaignsAddresses = async (contractInstance, campaignsCount) => {
  const campaignsAddressesPending = [];

  for (let i = 1; i <= campaignsCount; i++) {
    campaignsAddressesPending.push(contractInstance
      .methods.campaigns(i).call());
  }
  const campaignsAddressesPromisses = await Promise.all(campaignsAddressesPending);

  return campaignsAddressesPromisses;
};

export const getNftsAddresses = async (contractInstance, userAccount, userNftCount) => {
  const userNftsAddressesPromises = [];

  for (let i = 1; i <= +userNftCount; i++) {
    const userNftAddress = contractInstance
      .methods.donatersNfts(userAccount, i).call();
    userNftsAddressesPromises.push(userNftAddress);
  }

  const resolvedNftsAdresses = await Promise.all(userNftsAddressesPromises);

  console.log(resolvedNftsAdresses);

  return resolvedNftsAdresses;
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

export const filterNftInstance = async (web3, abi, contractAddress) => {
  const { methods: nftRewardMethods } = new web3
    .eth.Contract(abi, contractAddress);

  const { name, image, description } = await
  fetch(await nftRewardMethods.tokenURI(0).call()).then((res) => res.json());

  return {
    name,
    image: image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
    description,
  };
};
