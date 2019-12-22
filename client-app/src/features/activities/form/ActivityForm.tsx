import React, { useState, FormEvent, useContext } from 'react';
import { Button, Segment, Form } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

const emptyActivity: IActivity = {
  id: '',
  title: '',
  description: '',
  date: '',
  category: '',
  venue: '',
  city: ''
};

const ActivityForm: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    makeActivity,
    closeForm,
    selectedActivity,
    submitting
  } = activityStore;

  const InitializeActivity = () => {
    if (selectedActivity) {
      return selectedActivity;
    } else {
      return emptyActivity;
    }
  };

  const [activity, setActivity] = useState<IActivity>(InitializeActivity);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = async () => {
    if (activity.id.length === 0) {
      await setActivity({ id: v4(), ...activity });
      makeActivity(activity, true);
    } else makeActivity(activity);
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder="Title"
          name="title"
          value={activity.title}
          onChange={e => handleInputChange(e)}
        />
        <Form.TextArea
          rows={2}
          placeholder="Description"
          name="description"
          value={activity.description}
          onChange={e => handleInputChange(e)}
        />
        <Form.Input
          placeholder="Category"
          name="category"
          value={activity.category}
          onChange={e => handleInputChange(e)}
        />
        <Form.Input
          placeholder="Date"
          type="datetime-local"
          name="date"
          value={
            activity.date
              ? activity.date
              : new Date().toISOString().split('.')[0]
          }
          onChange={e => handleInputChange(e)}
        />
        <Form.Input
          placeholder="City"
          name="city"
          value={activity.city}
          onChange={e => handleInputChange(e)}
        />
        <Form.Input
          placeholder="Venue"
          name="venue"
          value={activity.venue}
          onChange={e => handleInputChange(e)}
        />
        <Button
          loading={submitting}
          floated="right"
          type="submit"
          content="Submit"
          positive
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={closeForm}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
