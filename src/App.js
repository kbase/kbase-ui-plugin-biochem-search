import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import Tabs from './Tabs';
import CompoundTable from './CompoundTable';
import ReactionTable from './ReactionTable';

class App extends Component {
  render() {
    return (
      <div className="container m-3 p-0">
        <Tabs>
          <div label="Compounds">
            <CompoundTable/>
          </div>
          <div label="Reactions">
            <ReactionTable/>
          </div>
        </Tabs>
      </div>
    );
  }
}

export default App;
