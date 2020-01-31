import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null
        }
    }

    static getDerivedStateFromError(error) {
        return {
            errorMessage: error.message
        }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Caught by ErrorBoundary', error, errorInfo);
    }

    render() {
        if (this.state.errorMessage) {
            const message = this.state.errorMessage;
            return <div className="alert-error">{message}</div>;
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    errorMessage: PropTypes.string
}