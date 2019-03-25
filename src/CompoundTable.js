import React, { Component } from 'react';
import BiochemistryTable from "./BiochemistryTable";

class CompoundTable extends Component {
    imgFormatter = (cell, row) => {
        return (
            <img src={`http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/${cell}.png`}
                alt="" style={{height: '100px'}} onError={i => i.target.src=''}/>
        );
    };

    aliasFormatter = (cell, row) => {
        return (
            <span>{String(cell).replace(/\|/g, ', ').replace(/;/g, '\n')}</span>
        );
    };

    expandRow = {
        renderer: row => {
            return (
                <div className="row">
                    <div className="col-sm-4">
                        <img src={`http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/${row.id}.png`}
                             alt="" onError={i => i.target.src=''} className='compound-detail-image'/>
                    </div>
                    <div className="col-sm-8">
                        <ul style={{'list-style-type': 'none'}}>
                            <li><strong>Abbreviation:</strong> {row.abbreviation}</li>
                            <li><strong>DeltaG:</strong> {row.deltag}</li>
                            <li><strong>DeltaG Error:</strong> {row.deltagerr}</li>
                            <li><strong>pKa:</strong> {row.pka}</li>
                            <li><strong>pKb:</strong> {row.pkb}</li>
                            <li><strong>InChIKey:</strong> {row.inchikey}</li>
                            <li><strong>SMILES:</strong> {row.smiles}</li>
                            <li><strong>Is Core:</strong> {row.is_core}</li>
                            <li><strong>Is Cofactor:</strong> {row.is_cofactor}</li>
                            <li><strong>Is Obsolete:</strong> {row.is_obsolete}</li>
                            <li><strong>Source:</strong> {row.source}</li>
                        </ul>
                    </div>
                </div>
            )},
        showExpandColumn: true,
        onlyOneExpanding: true
    };

    state = {
        table_items: [],
        search_text: '',
        message: 'Loading...',
        columns: [{
            dataField: 'id',
            text: 'ID',
            sort: true,
        }, {
            dataField: 'id',
            text: 'Image',
            formatter: this.imgFormatter
        }, {
            dataField: 'name',
            text: 'Name',
            sort: true,
        }, {
            dataField: 'formula',
            text: 'Formula',
            sort: true,
        }, {
            dataField: 'mass',
            text: 'Mass',
            sort: true,
        }, {
            dataField: 'charge',
            text: 'Charge',
            sort: true,
        }, {
            dataField: 'aliases',
            text: 'Aliases',
            formatter: this.aliasFormatter,
        }]
    };

    render() {
        return (
            <BiochemistryTable
                columns={this.state.columns}
                expandRow={this.expandRow}
                githubURL={'https://raw.githubusercontent.com/ModelSEED/ModelSEEDDatabase/dev/Biochemistry/compounds.json'}
                relationEngineURL={'https://ci.kbase.us/services/relation_engine_api/api/query_results/?view=search_compounds&batch_size=9999999'}
            />
        );
    }
}

export default CompoundTable;
