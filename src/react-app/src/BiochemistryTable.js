import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';

const ENTER_KEY = 13;

const SEARCH_STATE_NONE = 'SEARCH_STATE_NONE';
const SEARCH_STATE_SEARCHING = 'SEARCH_STATE_SEARCHING';
const SEARCH_STATE_SUCCESS = 'SEARCH_STATE_SUCCESS';
const SEARCH_STATE_ERROR = 'SEARCH_STATE_ERROR'

class BiochemistryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            search_text: '',
            message: '',
            searchState: SEARCH_STATE_NONE,
            error: ''
        };
    }

    handleChange(event) {
        this.setState({
            search_text: event.target.value
        });
    }

    handleKeyPress(event) {
        if (event.keyCode === ENTER_KEY || event.which === ENTER_KEY) {
            this.doSearch();
        }
    }

    handleSearchButtonClick() {
        this.doSearch();
    }

    loadAll() {
        // This is a bit of a hack but the static compounds file from github has the same content and is MUCH faster to load
        // axios.get(this.props.githubURL).then((response) => {
        //     for (let i = 0; i < response.data.length; i++) {
        //         response.data[i]._key = response.data[i].id;
        //     }
        //     this.setState({
        //         table_items: response.data,
        //         message: `${response.data.length.toLocaleString()} items found`
        //     });
        // });
    }

    doSearch() {
        this.setState({
            searchState: SEARCH_STATE_SEARCHING
        });
        if (!this.state.search_text) {
            // this.loadAll();
            this.setState({
                searchState: SEARCH_STATE_NONE
            });
        } else {
            axios
                .post(this.props.relationEngineURL, {
                    search_text: this.state.search_text,
                    all_documents: false,
                    offset: 0,
                    result_limit: 9999999,
                    include_obsolete: true
                })
                .then((response) => {
                    this.setState({
                        tableData: response.data.results,
                        message: `${response.data.results.length.toLocaleString()} items found`,
                        searchState: SEARCH_STATE_SUCCESS
                    });
                })
                .catch((err) => {
                    this.setState({
                        searchState: SEARCH_STATE_ERROR,
                        error: err.message,
                        message: err.message
                    });
                });
        }
    }

    componentDidMount() {
        this.loadAll();
    }

    renderNoData() {
        switch (this.state.searchState) {
            case SEARCH_STATE_NONE:
                return <div className="well">
                    Please search for {this.props.title} above
                </div>;
            case SEARCH_STATE_SEARCHING:
                // Don't need to handle the "data" case, since this is only rendered
                // if there is no data.
                return <div className="well">
                    Searching... <span class="fa fa-spinner fa-spin" />
                </div>;
            case SEARCH_STATE_SUCCESS:
                return <div className="well">
                    NO DATA FOUND by the search <i>{this.state.search_text}</i>
                </div>;
            case SEARCH_STATE_ERROR:
                return <div className="well">
                    Error fetching {this.props.title}: <span class="text-danger">{this.state.error}</span>
                </div>;
        }
    }

    handleTableChange() {
        console.log('table changed...');
    }

    renderMessage() {
        switch (this.state.searchState) {
            case SEARCH_STATE_NONE:
                return 'Please enter one or more search terms';
            case SEARCH_STATE_SEARCHING:
                return 'Searching... <span class="fa fa-spinner fa-spin"';
            case SEARCH_STATE_SUCCESS:
                return `${this.state.searchData.length.toLocaleString()} items found`;
            case SEARCH_STATE_ERROR:
                return <span class="text-danger">Error: {this.state.error}</span>
        }
        // ${response.data.results.length.toLocaleString()} items found`
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col mb-3 input-group form-inline justify-content-end">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search..."
                            value={this.state.search_text}
                            onChange={this.handleChange.bind(this)}
                            onKeyPress={this.handleKeyPress.bind(this)}
                        />
                        <div className="input-group-append" onClick={this.handleSearchButtonClick.bind(this)}>
                            <button className="input-group-text">
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>
                    <div className="col">
                        {this.renderMessage()}
                    </div>
                </div>
                <BootstrapTable
                    keyField="id"
                    headerClasses="table-header"
                    data={this.state.tableData}
                    columns={this.props.columns}
                    pagination={paginationFactory()}
                    expandRow={this.props.expandRow}
                    noDataIndication={this.renderNoData()}
                    handleTableChange={this.handleTableChange}
                />
            </div>
        );
    }
}

BiochemistryTable.propTypes = {
    expandRow: PropTypes.object,
    columns: PropTypes.array,
    relationEngineURL: PropTypes.string.isRequired,
    githubURL: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default BiochemistryTable;
