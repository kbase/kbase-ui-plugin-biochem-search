import React, { Component } from 'react';
import BiochemistryTable from "./BiochemistryTable";
import {compound_image_src, github_url, relation_engine_url} from "./common";


class ReactionTable extends Component {
    aliasFormatter = (cell, row) => {
        return <span>{String(cell).replace(/\|/g, ', ').replace(/;/g, '\n')}</span>
    };

    renderCompound = (comp_txt) => {
        const [, stoic, cid] = /(\([0-9.]+\)) (\w+)/.exec(comp_txt);
        return (
            <React.Fragment key={comp_txt}>
                <div className={'col-md-auto p-0'}>
                    {stoic}
                </div>
                <div className={'col-md-auto'}>
                    <img src={compound_image_src(cid)}
                         alt="" style={{height: '110px'}} onError={i => i.target.src=''}/>
                </div>
            </React.Fragment>
        )

    };

    renderHalfRxn(compounds){
        return compounds.split("+")
            .map(i => {return this.renderCompound(i)})
            .reduce((prev, curr) => [prev, <h4 key={curr} className='col-md-auto'> + </h4>, curr])
    };

    reactionImage = (row) => {
        const [reactants, products] = row.code.split(" <=> ");
        let sign = '↔';
        if (row.direction === ">") {
            sign = '→';
        } else if (row.direction === "<") {
            sign = '←';
        }
        return (
            <div className="container">
                <div className="row align-items-center">
                    {this.renderHalfRxn(reactants)}
                    <h4 className='col-md-auto'>{sign}</h4>
                </div>
                <div className="row align-items-center">
                    {this.renderHalfRxn(products)}
                </div>
            </div>
        )
    };

    expandRow = {
        renderer: row => {
            return (
                <div className="row">
                    <div className="col-sm">
                        {this.reactionImage(row)}
                    </div>
                    <div className="col-sm">
                        <ul style={{'listStyleType': 'none'}}>
                            <li><strong>Abbreviation:</strong> {row.abbreviation}</li>
                            <li><strong>Reaction definition:</strong> {row.definition}</li>
                            <li><strong>DeltaG:</strong> {row.deltag}</li>
                            <li><strong>DeltaG Error:</strong> {row.deltagerr}</li>
                            <li><strong>Direction:</strong> {row.direction}</li>
                            <li><strong>Reversibility:</strong> {row.reversibility}</li>
                            <li><strong>Is Transport:</strong> {row.is_transport}</li>
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
        columns: [{
            dataField: 'id',
            text: 'ID',
            sort: true,
        }, {
            dataField: 'name',
            text: 'Name',
            sort: true,
        }, {
            dataField: 'equation',
            text: 'Equation',
        }, {
            dataField: 'deltag',
            text: 'deltaG',
            sort: true,
        }, {
            dataField: 'status',
            text: 'Status',
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
                githubURL={`${github_url}/reactions.json`}
                relationEngineURL={`${relation_engine_url}/?view=search_reactions&batch_size=9999999`}
            />
        );
    }
}

export default ReactionTable;
