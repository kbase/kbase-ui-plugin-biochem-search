define([
    'bluebird',
    'kb_lib/html',
    'kb_lib/htmlBootstrapBuilders',
    './lib/utils'
], function (
    Promise,
    html,
    BS,
    Utils
) {
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
            h2 = t('h2'),
            p = t('p'),
            div = t('div');

        class Panel {
            constructor({ runtime }) {
                this.runtime = runtime;

                this.hostNode = null;
                this.container = null;
            }

            layout() {
                return div({
                    class: 'plugin_biochem-search container-fluid'
                }, [
                        div({
                            class: 'row'
                        }, [
                                div({ class: 'col-sm-6' }, [
                                    h2('Sample Simple Plugin'),
                                    p([
                                        'This is a very simple sample plugin. It consists of just a single panel, with ',
                                        'some helper functions in lib/utils.js.'
                                    ]),

                                ]),
                                div({ class: 'col-sm-6' }, [
                                    BS.buildPanel({
                                        title: 'Sample Panel',
                                        body: div([
                                            p('This is a simple panel in a simple widget'),
                                            p([
                                                'It does\'t do much other than demonstrate the relatively easy creation of ',
                                                'a bootstrap panel within a ui panel.'
                                            ]),
                                            p(Utils.something())
                                        ])
                                    })
                                ])
                            ])
                    ]);
            }

            createContainer() {
                const temp = document.createElement('div');
                temp.classList.add('plugin_biochem-search');
                return temp;
            }

            /* attach event
            * This attach() function implements the attach lifecycle event
            * in the Panel Widget lifecycle interface.
            * It is invoked at  point at which the parent environment has
            * obtained a concerete DOM node at which to attach this Panel,
            * and is ready to allow the Panel to attach itself to it.
            * The Panel should not do anything with the provided node
            * other than attach its own container node. This is because 
            * in some environments, it may be that the provided node is
            * long lived. A panel should not, for example, attach DOM listeners
            * to it.
            * 
            */
            attach(node) {
                /* creating our attachment point
                *  Here we save the provided node in the mount variable,
                *  and attach our own container node to it. This pattern
                *  allows us to attach event listeners as we wish to 
                *  our own container, so that we have more control
                *  over it. E.g. we can destroy and recreate it if we
                *  want another set of event listeners and don't want
                *  to bother with managing them all individually.
                */
                this.hostNode = node;
                this.container = hostNode.appendChild(this.createContainer());
                return null;
            }

            start(params) {
                /* DOC: dom access
                * In this case we are keeping things simple by using 
                * the plain DOM API. We could also use jquery 
                * here if we wish to.
                */
                this.container.innerHTML = this.layout();

                /* DOC: runtime interface
                * Since a panel title is also, logically, the title of
                * the "page" we use the runtimes event bus to emit the
                * 'title' event to the application. The application 
                * takes care of modifying the window panel to accomodate
                * it.
                */
                this.runtime.send('ui', 'setTitle', 'Simple Sample Plugin Title');
            }

            stop() {
                return null;
            }

            detach() {
                if (this.hostNode && this.container) {
                    this.hostNode.removeChild(this.container);
                }
            }
        }

        return SimpleSamplePanel;
    });