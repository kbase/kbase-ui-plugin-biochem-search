import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';

export default class Tabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'Compounds'
        };
    }

    onClickTabItem(tab) {
        this.setState({ activeTab: tab });
    }

    componentDidMount() {
        const kids = React.Children.toArray(this.props.children);
        if (kids.length) {
            this.setState({ activeTab: kids[0].props.label });
        }
    }

    renderTabs() {
        return (
            <div className="tabs" data-k-b-testhook-component="tabs">
                <ol className="tab-list">
                    {React.Children.map(this.props.children, (child) => {
                        const { label } = child.props;
                        return (
                            <Tab
                                activeTab={this.state.activeTab}
                                key={label}
                                label={label}
                                onClick={this.onClickTabItem.bind(this)}
                            />
                        );
                    })}
                </ol>
                <div className="tab-content">
                    {React.Children.map(this.props.children, (child) => {
                        if (child.props.label === this.state.activeTab) {
                            return child.props.children;
                        }
                    })}
                </div>
            </div>
        );
    }

    render() {
        if (this.props.children) {
            return this.renderTabs();
        }
    }
}

Tabs.propTypes = {
    children: PropTypes.instanceOf(Array).isRequired
};
