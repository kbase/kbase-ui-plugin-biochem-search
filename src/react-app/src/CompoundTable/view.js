import React, { Component } from 'react';
import BiochemistryTable from '../BiochemistryTable';
import { compound_image_src } from '../common';

class CompoundTable extends Component {
    static imgFormatter(cell) {
        return (
            <img
                src={compound_image_src(cell)}
                alt=""
                style={{ height: '100px' }}
                onError={(i) => (i.target.src = '')}
            />
        );
    }

    static aliasFormatter(cell) {
        return (
            <span>
                {String(cell)
                    .replace(/\|/g, ', ')
                    .replace(/;/g, '\n')}
            </span>
        );
    }

    constructor(props) {
        super(props);
        this.expandRow = {
            renderer: (row) => {
                return (
                    <div className="row">
                        <div className="col-sm-4">
                            <img
                                src={compound_image_src(row.id)}
                                alt=""
                                onError={(i) => (i.target.src = '')}
                                className="compound-detail-image"
                            />
                        </div>
                        <div className="col-sm-8">
                            <ul style={{ listStyleType: 'none' }}>
                                <li>
                                    <strong>Abbreviation:</strong> {row.abbreviation}
                                </li>
                                <li>
                                    <strong>DeltaG:</strong> {row.deltag}
                                </li>
                                <li>
                                    <strong>DeltaG Error:</strong> {row.deltagerr}
                                </li>
                                <li>
                                    <strong>pKa:</strong> {row.pka}
                                </li>
                                <li>
                                    <strong>pKb:</strong> {row.pkb}
                                </li>
                                <li>
                                    <strong>InChIKey:</strong> {row.inchikey}
                                </li>
                                <li>
                                    <strong>SMILES:</strong> {row.smiles}
                                </li>
                                <li>
                                    <strong>Is Core:</strong> {row.is_core}
                                </li>
                                <li>
                                    <strong>Is Cofactor:</strong> {row.is_cofactor}
                                </li>
                                <li>
                                    <strong>Is Obsolete:</strong> {row.is_obsolete}
                                </li>
                                <li>
                                    <strong>Source:</strong> {row.source}
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            },
            showExpandColumn: true,
            onlyOneExpanding: true,
            expanded: []
        };

        this.state = {
            table_items: [],
            search_text: '',
            message: '',
            columns: [
                {
                    dataField: '_key',
                    text: 'ID',
                    sort: true
                },
                {
                    dataField: 'id',
                    text: 'Image',
                    formatter: CompoundTable.imgFormatter
                },
                {
                    dataField: 'name',
                    text: 'Name',
                    sort: true
                },
                {
                    dataField: 'formula',
                    text: 'Formula',
                    sort: true
                },
                {
                    dataField: 'mass',
                    text: 'Mass',
                    sort: true
                },
                {
                    dataField: 'charge',
                    text: 'Charge',
                    sort: true
                },
                {
                    dataField: 'aliases',
                    text: 'Aliases',
                    formatter: CompoundTable.aliasFormatter
                }
            ]
        };
    }

    render() {
        console.log('props', this.props);
        return (
            <BiochemistryTable
                columns={this.state.columns}
                expandRow={this.expandRow}
                // githubURL={`${github_url}/compounds.json`}
                // relationEngineURL={`${relation_engine_url}/?view=search_compounds&batch_size=9999999`}
                relationEngineURL={this.props.relationEngineURL}
                view="search_compounds"
                title="Compounds"
            />
        );
    }
}

export default CompoundTable;
