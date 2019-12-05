import React, { useState, FormEvent } from 'react';
import { Button, Segment, Form } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
  setEditMode: (editMode: boolean) => void;
  selectedActivity: IActivity | null;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

const emptyActivity: IActivity = {
  id: '',
  title: '',
  description: '',
  date: '',
  category: '',
  venue: '',
  city: ''
};
const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  selectedActivity: initialActivity,
  createActivity,
  editActivity
}) => {
  const InitializeActivity = () => {
    if (initialActivity) {
      return initialActivity;
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

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
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
          type="datetime-local"
          placeholder="Date"
          name="date"
          value={activity.date}
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
        <Button floated="right" type="submit" content="Submit" positive />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
