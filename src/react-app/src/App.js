import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import ErrorBoundary from './ErrorBoundary';
import { createReduxStore } from './redux/store';
import { Provider } from 'react-redux';
import { AppBase, AuthGate } from '@kbase/ui-components';
import Main from './Main';

const store = createReduxStore();

class App extends Component {
    render() {
        return (
            <div className="responsive-container" data-k-b-testhook-plugin="biochem-search">
                <ErrorBoundary>
                    <Provider store={store}>
                        <AppBase>
                            <AuthGate required={true}>
                                <Main />
                            </AuthGate>
                        </AppBase>
                    </Provider>
                </ErrorBoundary>
            </div>
        );
    }
}

export default App;
