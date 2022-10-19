import { FC } from 'react';
import { useFormik } from 'formik';
import './CreateCampaignForm.scss';

export const CreateCampaignForm: FC = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      endAtDate: '',
      requiredAmount: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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

        <label htmlFor="endAtDate">
          End date
          <input
            id="endAtDate"
            className="date-input"
            placeholder="dd-mm-yyyy"
            name="endAtDate"
            type="date"
            onChange={formik.handleChange}
            value={formik.values.endAtDate}
          />
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
