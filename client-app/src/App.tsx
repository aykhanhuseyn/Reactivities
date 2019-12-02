import React, { Component } from 'react';
import axios from 'axios';
import { Header, Icon, List } from 'semantic-ui-react';
import './App.css';

interface IAppState {
  values: Array<IObject>;
}
interface IObject {
  id: number;
  name: string;
}

class App extends Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      values: []
    };
  }
  componentDidMount() {
    axios.get('http://localhost:5000/api/values').then(response => {
      this.setState({ values: response.data });
    });
  }
  render() {
    return (
      <div>
        <Header as="h2">
          <Icon name="users" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.values.map((data: any) => (
            <List.Item key={data.id}>{data.name}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
