import React, { useContext } from 'react';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {activitiesByDate, selectActivity, submitting, target, deleteActivity} = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((data: IActivity) => (
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
                  loading={target === data.id && submitting}
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={e => deleteActivity(e, data.id)}
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

export default observer(ActivityList);
