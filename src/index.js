import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import MessageList from './components/MessageList';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';


class App extends Component {

  render() {
    return <Container >
      <MessageList />
    </Container >
  }
}

render(<App />, document.getElementById('root'));
