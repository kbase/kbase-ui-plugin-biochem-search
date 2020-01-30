import { connect } from "react-redux";
import Component from './view';

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

    console.log('STATE', state);

    if (!userAuthorization) {
        throw new Error('Not authorized');
    }

    const { token } = userAuthorization;

    return { token, relationEngineURL }
}

function mapDispatchToProps(dispatch, props) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)