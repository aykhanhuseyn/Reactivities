import React from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';

interface IProps {
  activities: Array<IActivity>;
  selectActivity: (id: string) => void;
  deleteActivity: (
    id: string,
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => void;
  submitting: boolean;
  target: string;
}

const ActivityList: React.FC<IProps> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting,
  target
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((data: IActivity) => (
          <Item key={data.id}>
            <Item.Content>
              <Item.Header as="a">{data.title}</Item.Header>
              <Item.Meta>{data.date}</Item.Meta>
              <Item.Description>
                <div>{data.description}</div>
                <div>
                  {data.city}, {data.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  onClick={() => selectActivity(data.id)}
                />
                <Button
                  name={data.id}
                  loading={target == data.id && submitting}
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={e => deleteActivity(data.id, e)}
                />
                <Label
                  basic
                  content={data.category}
                  style={{ textTransform: 'capitalize' }}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;
