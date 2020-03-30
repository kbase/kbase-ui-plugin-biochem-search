import React, { Component } from 'react';
import BiochemistryTable from '../BiochemistryTable';
import { compoundImagePath } from '../common';

class CompoundTable extends Component {
    static imgFormatter(cell) {
        return (
            <img
                src={compoundImagePath(cell)}
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

        this.columns = [
            {
                dataField: 'id',
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
        ];

        this.expandRow = {
            renderer: (row) => {
                return (
                    <div className="row">
                        <div className="col-sm-4">
                            <img
                                src={compoundImagePath(row.id)}
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
            message: ''
        }
    }

    render() {
        const url = this.props.relationEngineURL + '/api/v1/query_results/';
        return (
            <BiochemistryTable
                columns={this.columns}
                expandRow={this.expandRow}
                relationEngineURL={url}
                view="search_compounds"
                title="Compounds"
            />
        );
    }
}

export default CompoundTable;
