import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';

const ENTER_KEY = 13;

class BiochemistryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_items: [],
            search_text: '',
            message: 'Loading...'
        };
    }

    handleChange(event) {
        this.setState({ search_text: event.target.value });
    }

    handleKeyPress(event) {
        if (event.keyCode === ENTER_KEY || event.which === ENTER_KEY) {
            this.doSearch();
        }
    }

    handleClick() {
        this.doSearch();
    }

    loadAll() {
        // This is a bit of a hack but the static compounds file from github has the same content and is MUCH faster to load
        axios.get(this.props.githubURL).then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                response.data[i]._key = response.data[i].id;
            }
            this.setState({
                table_items: response.data,
                message: `${response.data.length.toLocaleString()} items found`
            });
        });
    }

    doSearch() {
        if (!this.state.search_text) {
            this.loadAll();
        } else {
            axios
                .post(this.props.relationEngineURL, {
                    search_text: this.state.search_text,
                    all_documents: 0,
                    offset: 0,
                    result_limit: 9999999,
                    include_obsolete: 1
                })
                .then((response) => {
                    this.setState({
                        table_items: response.data.results,
                        message: `${response.data.results.length.toLocaleString()} items found`
                    });
                });
        }
    }

    componentDidMount() {
        this.loadAll();
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <h5>{this.state.message}</h5>
                    </div>
                    <div className="col mb-3 input-group form-inline justify-content-end">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search..."
                            value={this.state.search_text}
                            onChange={this.handleChange.bind(this)}
                            onKeyPress={this.handleKeyPress.bind(this)}
                        />
                        <div className="input-group-append" onClick={this.handleClick.bind(this)}>
                            <button className="input-group-text">
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>
                </div>
                <BootstrapTable
                    keyField="id"
                    headerClasses="table-header"
                    data={this.state.table_items}
                    columns={this.props.columns}
                    pagination={paginationFactory()}
                    expandRow={this.props.expandRow}
                />
            </div>
        );
    }
}

BiochemistryTable.propTypes = {
    expandRow: PropTypes.object,
    columns: PropTypes.array,
    relationEngineURL: PropTypes.string.isRequired,
    githubURL: PropTypes.string.isRequired
};

export default BiochemistryTable;
