import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Tabs from './Tabs';
import CompoundTable from './CompoundTable';
import ReactionTable from './ReactionTable';
import ErrorBoundary from './ErrorBoundary';
import { createReduxStore } from './redux/store';
import { Provider } from 'react-redux';
import { AppBase, AuthGate } from '@kbase/ui-components';

const store = createReduxStore();

class App extends Component {
    render() {
        return (
            <div className="container m-3 p-0" data-k-b-testhook-plugin="biochem-search">
                <ErrorBoundary>
                    <Provider store={store}>
                        <AppBase>
                            <AuthGate required={true}>
                                <Tabs>
                                    <div label="Compounds">
                                        <CompoundTable />
                                    </div>
                                    <div label="Reactions">
                                        <ReactionTable />
                                    </div>
                                </Tabs>
                            </AuthGate>
                        </AppBase>
                    </Provider>
                </ErrorBoundary>
            </div>
        );
    }
}

export default App;
