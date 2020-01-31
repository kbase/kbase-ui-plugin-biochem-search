import React from 'react';
import CompoundTable from '../CompoundTable';
import ReactionTable from '../ReactionTable';
import Tabs from '../Tabs';

export default class Main extends React.Component {
    componentDidMount() {
        this.props.setTitle('Biochem Search');
    }
    render() {
        return <Tabs>
            <div label="Compounds">
                <CompoundTable />
            </div>
            <div label="Reactions">
                <ReactionTable />
            </div>
        </Tabs>
    }
}
