import { FC, useEffect } from 'react';
import { useFormik } from 'formik';
import './CreateCampaignForm.scss';
import useEth from '../../contexts/EthContext/useEth';
import { filterCampaignInstance } from '../../contexts/EthContext/helpers/helpers';
import { actions } from '../../contexts/EthContext';

export const CreateCampaignForm: FC = () => {
  const {
    state: {
      web3, campaignAbi, crowdfundingPlatformInstance, userAccount,
    }, dispatch,
  } = useEth();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      campaignDuration: '2592000',
      requiredAmount: '1',
    },
    onSubmit: async ({
      title, description, campaignDuration, requiredAmount,
    }) => {
      const endAt = Math.floor(Date.now() / 1000) + +campaignDuration;
      const ethToWei = web3.utils.toWei(`${requiredAmount}`, 'ether');

      await crowdfundingPlatformInstance.methods
        .startCampaign(title, description, ethToWei, endAt).send({ from: userAccount })
        .then(async ({ events: { CampaignStarted: { returnValues } } }: any) => {
          const campaign = await filterCampaignInstance(
            web3,
            campaignAbi,
            returnValues[1],
          );

          dispatch({
            type: actions.addCampaign,
            data: campaign,
          });
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

        <button className="form-button" type="submit">Submit</button>
      </form>
    </div>
  );
};
