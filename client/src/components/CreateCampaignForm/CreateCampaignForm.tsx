import { FC } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import useEth from '../../contexts/EthContext/useEth';
import { filterCampaignInstance } from '../../contexts/EthContext/helpers/helpers';
import { actions } from '../../contexts/EthContext';
import './CreateCampaignForm.scss';

export const CreateCampaignForm: FC = () => {
  const navigate = useNavigate();

  const {
    state: {
      web3,
      campaignAbi,
      crowdfundingPlatformInstance,
      userAccount,
    }, dispatch,
  } = useEth();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      campaignDuration: '2592000',
      requiredAmount: '1',
      tokenName: '',
      tokenSymbol: '',
      CID: '',
    },
    onSubmit: async ({
      title,
      description,
      campaignDuration,
      requiredAmount,
      tokenName,
      tokenSymbol,
      CID,
    }) => {
      const endAt = Math.floor(Date.now() / 1000) + +campaignDuration;
      const ethToWei = web3.utils.toWei(`${requiredAmount}`, 'ether');
      const BASE_URL = process.env.REACT_APP_PINATA_IPFS;

      await crowdfundingPlatformInstance.methods
        .startCampaign(
          title,
          description,
          tokenName,
          tokenSymbol,
          CID,
          BASE_URL,
          ethToWei,
          endAt,
        ).send({ from: userAccount })
        .then(async ({ events: { CampaignStarted: { returnValues } } }: any) => {
          const campaign = await filterCampaignInstance(
            web3,
            campaignAbi,
            returnValues[1],
            userAccount,
          );

          dispatch({
            type: actions.addCampaign,
            data: campaign,
          });

          return campaign;
        }).then(({ id }: {id: number }) => {
          navigate(`/campaign/${id}`);
        });
    },
  });

  return (
    <div className="create-campaign">
      <h1>Create a New Campaign</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="title">
          Title of Campaign
          <input
            id="title"
            placeholder="Enter title or campaign name"
            name="title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
        </label>

        <label htmlFor="description">
          Description of Campaign
          <textarea
            id="description"
            placeholder="Enter campaign description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
        </label>

        <label htmlFor="campaignDuration">
          Campaign duration
          <select
            name="campaignDuration"
            value={formik.values.campaignDuration}
            onChange={formik.handleChange}
          >
            <option value="2592000">30 days</option>
            <option value="3888000">45 days</option>
            <option value="5184000">60 days</option>
          </select>
        </label>

        <label htmlFor="requiredAmount">
          Required amount (ETH)
          <input
            id="requiredAmount"
            placeholder="Enter amount of your campaign"
            name="requiredAmount"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.requiredAmount}
          />
        </label>

        <hr />

        <h2>Nft reward data</h2>

        <label htmlFor="tokenName">
          Enter name and symbol of your nft token.
          <input
            id="tokenName"
            placeholder="Name"
            name="tokenName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.tokenName}
          />
          <input
            id="tokenSymbol"
            placeholder="Symbol"
            name="tokenSymbol"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.tokenSymbol}
          />
        </label>

        <label htmlFor="nftMeta">
          Enter you nft metadata json CID.
          <input
            id="nftMeta"
            placeholder="CID"
            name="CID"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.CID}
          />
        </label>

        <button className="form-button" type="submit">Submit</button>
      </form>
    </div>
  );
};
