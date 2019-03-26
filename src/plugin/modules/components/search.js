define(['preact', 'bluebird', 'kb_lib/jsonRpc/genericClient', './navBar'], (Preact, Promise, GenericClient, NavBar) => {
    /* strict mode
     * We always set strict mode with the following magic javascript
     * incantation.
     */
    'use strict';

    const { Component, h } = Preact;

    class SearchComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                searchResults: [],
                searching: false,
                searchError: null
            };
            this.searchInput = Preact.createRef();
        }
        renderQuery() {
            return h(
                'div',
                {
                    style: {
                        border: '1px solid red',
                        padding: '4px',
                        margin: '4px'
                    }
                },
                h('p', null, 'So, here we are inside of the query renderer'),
                h('p', null, 'The query is : ' + this.props.query)
            );
        }

        static renderHeader() {
            return h(
                'div',
                {
                    style: {
                        flex: '0 0 auto'
                    }
                },
                'header here'
            );
        }

        renderResultsCount() {
            if (!this.state.searchResults) {
                return 'nothing';
            }
            // eslint-disable-next-line no-magic-numbers
            if (this.state.searchResults.length === 1) {
                return 'an item';
            }
            return String(this.state.searchResults.length) + ' items';
        }

        renderSearchStatus() {
            if (this.state.searchError) {
                return 'ERROR!';
            }
            if (!this.searchInput.current) {
                return h('span', null, 'Enter something to the left to search');
            }
            if (!this.searchInput.current.value) {
                return h('span', null, 'Enter something to the left to search');
            }
            if (this.state.searching) {
                return h('span', {
                    class: 'fa fa-spin fa-spinner'
                });
            }
            return h(
                'span',
                null,
                'Searching for ',
                h('b', null, this.searchInput.current.value),
                ', found ',
                this.renderResultsCount()
            );
        }

        renderSearchError() {
            if (!this.state.searchError) {
                return;
            }
            return h(
                'div',
                {
                    class: 'alert alert-danger'
                },
                this.state.searchError
            );
        }

        handleSubmit(e) {
            this.doSearch(this.searchInput.current.value);
            e.preventDefault();
        }

        renderSearchToolbar() {
            return h(
                'div',
                {
                    style: {
                        flex: '0 0 auto'
                    }
                },
                h(
                    'form',
                    {
                        onSubmit: this.handleSubmit.bind(this)
                    },
                    h('input', {
                        defaultValue: this.props.query,
                        ref: this.searchInput,
                        style: {
                            marginRight: '5px'
                        }
                    }),
                    h(
                        'button',
                        {
                            onClick: () => {},
                            style: {
                                marginRight: '5px'
                            }
                        },
                        h('span', { class: 'fa fa-search' })
                    )
                ),
                this.renderSearchStatus()
            );
        }

        static renderNoResults() {
            return h('p', null, 'Sorry, no results');
        }

        renderResultsTable() {
            return this.state.searchResults.map((result) => {
                console.log(result);
                return h(
                    'div',
                    { style: {
                            borderBottom: '1px solid silver',
                            flex: '1 1 0px',
                            display: 'flex',
                            flexDirection: 'row',
                            overflowY: 'auto'
                        }},
                    h('div', {},
                        h(
                            'a',
                            {
                                href: `/#biochem-search/compound/${result.ref}`
                            },
                            result.title
                        )
                    ),
                    h('div', {}, result.data.id),
                    h('div', {}, result.data.name)
                );
            });
        }

        renderSearchResults() {
            if (this.state.searchError) {
                return;
            }
            return h(
                'div',
                {
                    style: {
                        flex: '1 1 0px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto'
                    }
                },
                this.state.searchResults.length ? this.renderResultsTable() : SearchComponent.renderNoResults()
            );
        }

        renderNavBar() {
            return h(NavBar, { searchQuery: this.searchInput.current && this.searchInput.current.value });
        }

        doSearch(query) {
            return Promise.try(() => {
                if (!query) {
                    this.setState({ searchResults: [] });
                    return;
                }
                const client = new GenericClient({
                    url: this.props.url,
                    module: 'KBaseSearchEngine',
                    token: this.props.token
                });
                const methodParams = {
                    object_types: ['Genome'],
                    match_filter: {
                        full_text_in_all: query,
                        exclude_subobjects: 1
                    },
                    // sorting_rules: [],
                    access_filter: {
                        with_private: 1,
                        with_public: 1
                    },
                    pagination: {
                        start: 0,
                        count: 10
                    },
                    post_processing: {
                        ids_only: 0,
                        skip_keys: 0,
                        skip_data: 0,
                        include_highlight: 0,
                        add_narrative_info: 1,
                        add_access_group: 1
                    }
                };
                this.setState({ searching: true, searchError: null });
                const guidRe = /^WS:([\d]+)\/([\d]+)\/([\d]+)$/;
                client
                    .callFunc('search_objects', [methodParams])
                    .then(([result]) => {
                        const searchResults = result.objects.map((object) => {
                            const guidMatch = object.guid.match(guidRe);
                            const [, workspaceId, objectId, version] = guidMatch;
                            return {
                                title: object.data.scientific_name,
                                ref: [workspaceId, objectId, version].join('/')
                            };
                        });
                        this.setState({ searchResults, searching: false });
                    })
                    .catch((err) => {
                        this.setState({ searchError: err.message, searching: false });
                    });
            });
        }

        // React Component Lifecycle Methods.
        componentDidMount() {
            this.doSearch(this.props.query);
        }

        render() {
            return h(
                'div',
                {
                    class: 'plugin_biochem-search_search'
                },
                this.renderNavBar(),
                h('iframe', {
                    src: 'https://kbase.github.io/kbase-ui-plugin-biochem-search/',
                    style: {border: 'none', width: '100%', height: '2500px', overflow: 'visible', scrolling:'no'},
                })
            );
        }
    }

    return SearchComponent;
});
