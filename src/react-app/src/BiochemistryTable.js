import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

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
            const url = new URL(this.props.relationEngineURL);
            if (this.props.view) {
                url.searchParams.append('view', this.props.view);
            }
            if (this.props.storedQuery) {
                url.searchParams.append('stored_query', this.props.storedQuery);
            }
            if (this.props.batchSize) {
                url.searchParams.append('batch_size', this.props.batchSize);
            }

            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    search_text: this.state.search_text,
                    all_documents: false,
                    offset: 0,
                    result_limit: 1000,
                    include_obsolete: true
                })
            })
                .then((response) => {
                    if (response.status !== 200) {
                        return response.json()
                            .then((errorResponse) => {
                                if (errorResponse.arango_message) {
                                    throw new Error(errorResponse.arango_message);
                                } else if (errorResponse.message) {
                                    throw new Error(errorResponse.message);
                                } else if (errorResponse.error) {
                                    throw new Error(errorResponse.error);
                                } else {
                                    console.error(errorResponse);
                                    throw new Error('Unknown error - unknown json response - check browser console');
                                }
                            });
                    }
                    return response.json();
                })
                .then((response) => {
                    this.setState({
                        tableData: response.data.results,
                        message: `${response.data.results.length.toLocaleString()} items found`,
                        searchState: SEARCH_STATE_SUCCESS
                    });
                })
                .catch((err) => {
                    console.error('ERROR', err);
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
        const content = () => {
            switch (this.state.searchState) {
                case SEARCH_STATE_NONE:
                    return <span>
                        Please search for {this.props.title} above
                        </span>
                case SEARCH_STATE_SEARCHING:
                    // Don't need to handle the "data" case, since this is only rendered
                    // if there is no data.
                    return <span>
                        Searching... <span className="fa fa-spinner fa-spin" />
                    </span>;
                case SEARCH_STATE_SUCCESS:
                    return <span>
                        NO DATA FOUND by the search <i>{this.state.search_text}</i>
                    </span>;
                case SEARCH_STATE_ERROR:
                    return <span>
                        Error fetching {this.props.title}: <span className="text-danger">{this.state.error}</span>
                    </span>;
                default:
                    return <span>
                        <span className="text-danger">Invalid state {this.state.searchState}</span>
                    </span>;
            }
        };
        return <div className="well">{content()}</div>;

    }

    handleTableChange() {
        console.log('table changed...');
    }

    renderMessage() {
        switch (this.state.searchState) {
            case SEARCH_STATE_NONE:
                return 'Please enter one or more search terms';
            case SEARCH_STATE_SEARCHING:
                return <span>
                    Searching... <span className="fa fa-spinner fa-spin" />
                </span>;
            case SEARCH_STATE_SUCCESS:
                return `${this.state.searchData.length.toLocaleString()} items found`;
            case SEARCH_STATE_ERROR:
                return <span className="text-danger">Error: {this.state.error}</span>;
            default:
                return <span className="text-danger">Invalid state {this.state.searchState}</span>;
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
    // githubURL: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    view: PropTypes.string,
    storedQuery: PropTypes.string
};

export default BiochemistryTable;
