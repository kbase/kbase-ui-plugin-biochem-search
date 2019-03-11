define(['preact', 'bootstrap'], (Preact) => {
    'use strict';

    const { Component, h } = Preact;

    class NavBar extends Component {
        constructor(params) {
            super(params);
        }

        renderNavBar() {
            return h(
                'div',
                {
                    class: 'plugin_biochem-search_navBar'
                },
                h(
                    'span',
                    {
                        class: 'plugin_biochem-search_navBarLabel'
                    },
                    'Search:'
                ),
                h(
                    'a',
                    {
                        href: `/#search?q=${this.props.searchQuery}`,
                        class: 'plugin_biochem-search_navBarTab'
                    },
                    'KBase - User Data, Genome Features, Reference Data'
                ),
                h(
                    'a',
                    {
                        href: `/#jgi-search?q=${this.props.searchQuery}`,
                        class: 'plugin_biochem-search_navBarTab'
                    },
                    'JGI'
                ),
                h(
                    'a',
                    {
                        href: `/#biochem-search/${encodeURIComponent(this.props.searchQuery)}`,
                        class: 'plugin_biochem-search_navBarTab plugin_biochem-search_navBarTabSelected'
                    },
                    'Biochem Search'
                )
            );
        }

        render() {
            return this.renderNavBar();
        }
    }

    return NavBar;
});
