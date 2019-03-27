define(['preact', 'kb_lib/html', './components/search'], function (Preact, html, SearchComponent) {
    /* strict mode
     * We always set strict mode with the following magic javascript
     * incantation.
     */
    'use strict';

    /*
     * html helper module
     * The html helper module is quite useful for building
     * html in a functional style. It has a generic tag function
     * builder, as well as methods to build more complex html
     * structures.
     */
    const t = html.tag,
        div = t('div');

    class Panel {
        /*
        constructor(params)
        The constructor typically just takes the ubiquitous runtime
        object.
        */
        constructor({ runtime }) {
            this.runtime = runtime;

            // It is not necessary to declare class properties
            // in the constructor, but it is polite.
            this.hostNode = null;
        }

        /*
        build() and friends
        This is not part of the widget api.
        A widget will commonly have a set of content building methods.
        Generally, rendering methods should be as short as possible, and
        decomposed into submethods.
        Note that in this style of widget, layout is typically build by composing
        functions created by html.tag(). Old-style widgets used this style
        quite liberally. Nowadays this style is mostly used just for simple top level
        panels, with the rest of the widgets composed of components, e.g. knockout components.
        */

        static buildLayout() {
            return div(
                {
                    class: 'plugin_biochem-search_searchPanel'
                },
                div(
                    {
                        class: 'plugin_biochem-search_bodyRow'
                    },
                    [
                        div({
                            id: 'plugin_biochem-search_searchComponentExample',
                            class: 'plugin_biochem-search_searchComponentContainer'
                        })
                    ]
                )
            );
        }

        /*
        attach(node)
        The ui widget api will call the attach method with a node upon which
        this widget may append whatever it likes.
        */
        attach(node) {
            this.hostNode = node;
            return null;
        }

        /*
        start(params)
        The ui will call the start() method for the widget after a successful attach.
        It passes the params object as determined from the route (as defined in
        this plugin's config.yml).
        */
        start({ q }) {
            // here is where you need to set up the entry point to this
            // plugin route. In this case we just build some markup above.
            // More generally, you might construct a component and mount it here.
            this.hostNode.innerHTML = Panel.buildLayout();

            const searchComponentNode = document.getElementById('plugin_biochem-search_searchComponentExample');
            Preact.render(
                Preact.h(SearchComponent, {
                    query: q,
                    token: this.runtime.service('session').getAuthToken(),
                    url: this.runtime.config('services.search.url')
                }),
                searchComponentNode
            );

            this.runtime.send('ui', 'setTitle', 'Biochemistry Search');
        }

        /*
        If any resources were created in the constructor, attach, or start,
        we can clean them up here. Examples include subwidgets, timers.
        */
        // eslint-disable-next-line class-methods-use-this
        stop() {
            return null;
        }

        /*
        A widget should clean up after itself, even though the
        ui will do it also.
        */
        detach() {
            // This is just a simple way to clear the node.
            this.hostNode.innerHTML = '';
        }
    }

    return Panel;
});
