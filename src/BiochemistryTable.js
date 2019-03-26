import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';

class BiochemistryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_items: [],
            search_text: '',
            message: 'Loading...',
        };
    };

    handleChange = (event) => {
        this.setState({search_text: event.target.value});
    };

    handleKeyPress = (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            this.doSearch();
        }
    };

    handleClick = (event) => {
        this.doSearch();
    };

    loadAll(){
        // This is a bit of a hack but the static compounds file from github has the same content and is MUCH faster to load
        axios.get(this.props.githubURL)
            .then(response => {
                for (let i=0; i<response.data.length; i++) {
                    response.data[i]._key = response.data[i].id
                }
                this.setState({
                    table_items: response.data,
                    message: `${response.data.length.toLocaleString()} items found`
                });
            });
    };

    doSearch() {
        if (!this.state.search_text){
            this.loadAll();
        }
        else {
            axios.post(this.props.relationEngineURL,
                {
                    "search_text": this.state.search_text,
                    "all_documents": 0,
                    "offset": 0,
                    "result_limit": 9999999,
                    "include_obsolete": 1
                })
                .then(response => {
                    this.setState({
                        table_items: response.data.results,
                        message: `${response.data.results.length.toLocaleString()} items found`
                    });
                });
        }
    };

    componentDidMount() {
        this.loadAll();
    };

    render() {
        return (
            <div>
                <div className='row'>
                    <div className="col">
                        <h5>{this.state.message}</h5>
                    </div>
                    <div className="col mb-3 input-group form-inline justify-content-end">
                        <input className='form-control'
                               type="text"
                               placeholder="Search..."
                               value={this.state.search_text}
                               onChange={this.handleChange}
                               onKeyPress={this.handleKeyPress}
                        />
                        <div className='input-group-append' onClick={this.handleClick}>
                            <button className="input-group-text">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <BootstrapTable
                    keyField='id'
                    headerClasses='table-header'
                    data={ this.state.table_items }
                    columns={ this.props.columns }
                    pagination={ paginationFactory() }
                    expandRow={ this.props.expandRow }
                />
            </div>
        );
    }
}

export default BiochemistryTable;
