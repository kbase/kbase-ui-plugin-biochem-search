import { connect } from "react-redux";
import Component from './view';
import { sendTitle } from '@kbase/ui-components';


function mapStateToProps(state, props) {
    const {
        auth: {
            userAuthorization
        },
        app: {
            config: {
                services: {
                    RelationEngine: { url: relationEngineURL }
                }
            }
        }
    } = state;

    if (!userAuthorization) {
        throw new Error('Not authorized');
    }

    const { token } = userAuthorization;

    return { token, relationEngineURL }
}

function mapDispatchToProps(dispatch, props) {
    return {
        setTitle: (title) => {
            dispatch(sendTitle(title));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)