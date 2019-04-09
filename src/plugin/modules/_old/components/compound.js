define(['preact', 'kb_lib/jsonRpc/genericClient', 'bootstrap', './navBar'], (Preact, GenericClient, NavBar) => {
    'use strict';
    const { Component, h } = Preact;

    // function workspaceInfoToObject(wsInfo) {
    //     return {
    //         id: wsInfo[0],
    //         name: wsInfo[1],
    //         owner: wsInfo[2],
    //         modifiedAt: iso8601ToDate(wsInfo[3]),
    //         objectCount: wsInfo[4],
    //         userPermission: wsInfo[5],
    //         globalReadPermission: wsInfo[6] === 'r' ? true : false,
    //         lockStatus: wsInfo[7],
    //         metadata: wsInfo[8]
    //     };
    // }

    function objectInfoToObject(data) {
        const type = data[2].split(/[-.]/);

        return {
            id: data[0],
            name: data[1],
            // type: data[2],
            type: {
                id: data[2],
                module: type[0],
                name: type[1],
                majorVersion: parseInt(type[2], 10),
                minorVersion: parseInt(type[3], 10)
            },
            savedAt: iso8601ToDate(data[3]),
            version: data[4],
            savedBy: data[5],
            workspaceId: data[6],
            workspaceName: data[7],
            checksum: data[8],
            size: data[9],
            metadata: data[10],
            ref: data[6] + '/' + data[0] + '/' + data[4]
        };
    }

    function iso8601ToDate(dateString) {
        const isoRE = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d)(:?[:]*)(\d\d)/;
        const dateParts = isoRE.exec(dateString);
        if (!dateParts) {
            throw new TypeError('Invalid Date Format for ' + dateString);
        }
        // This is why we do this -- JS insists on the colon in the tz offset.
        const offset = dateParts[7] + dateParts[8] + ':' + dateParts[10];
        const newDateString =
            dateParts[1] +
            '-' +
            dateParts[2] +
            '-' +
            dateParts[3] +
            'T' +
            dateParts[4] +
            ':' +
            dateParts[5] +
            ':' +
            dateParts[6] +
            offset;
        return new Date(newDateString);
    }

    class CompoundComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                objectInfo: null,
                error: null
            };
        }

        fetchObjectInfo() {
            const client = new GenericClient({
                url: this.props.workspaceUrl,
                module: 'Workspace',
                token: this.props.token
            });
            const params = {
                objects: [
                    {
                        wsid: this.props.workspaceId,
                        objid: this.props.objectId,
                        ver: this.props.version
                    }
                ],
                includeMetadata: 1,
                ignoreErrors: 0
            };
            return client
                .callFunc('get_object_info3', [params])
                .then(([result]) => {
                    const objectInfo = objectInfoToObject(result.infos[0]);
                    this.setState({ objectInfo, error: null });
                })
                .catch((err) => {
                    console.error('ERROR fetching object info', err);
                    this.setState({ error: err });
                });
        }

        componentDidMount() {
            this.fetchObjectInfo();
        }

        static renderErrorAlert(errorMessage) {
            return h(
                'div',
                {
                    class: 'alert alert-danger'
                },
                errorMessage
            );
        }

        static renderMetadata(metadata) {
            if (!metadata) {
                return h('div', null, 'No metadata');
            }
            const rows = Object.keys(metadata).map((key) => {
                return h('tr', null, h('th', null, key), h('td', null, metadata[key]));
            });
            return h(
                'table',
                {
                    class: 'table'
                },
                h('tbody', null, rows)
            );
        }

        renderObject() {
            if (this.state.error) {
                return CompoundComponent.renderErrorAlert(this.state.error.message);
            }
            if (!this.state.objectInfo) {
                return h(
                    'div',
                    {
                        class: 'alert alert-info'
                    },
                    h('span', {
                        class: 'fa fa-spin fa-spinner'
                    })
                );
            }
            return h(
                'table',
                {
                    class: 'table'
                },
                h(
                    'tbody',
                    null,
                    h('tr', null, h('th', null, 'Workspace ID'), h('td', null, this.state.objectInfo.workspaceId)),
                    h('tr', null, h('th', null, 'Object ID'), h('td', null, this.state.objectInfo.id)),
                    h('tr', null, h('th', null, 'Version'), h('td', null, this.state.objectInfo.version)),
                    h(
                        'tr',
                        null,
                        h('th', null, 'Metadata'),
                        h('td', null, CompoundComponent.renderMetadata(this.state.objectInfo.metadata))
                    )
                )
            );
        }

        static renderNav() {
            return h(
                'div',
                null,
                h(
                    'a',
                    {
                        href: '/#/biochem-search'
                    },
                    'Back to Search'
                )
            );
        }

        render() {
            return h(
                'div',
                {
                    class: 'plugin_biochem-search_Component'
                },
                h(NavBar, { searchQuery: this.props.searchQuery }),
                CompoundComponent.renderNav(),
                this.renderObject()
            );
        }
    }

    return CompoundComponent;
});
