define(['preact', 'kb_lib/html', './components/compound'], function (Preact, html, CompoundComponent) {
    'use strict';

    const t = html.tag,
        h2 = t('h2'),
        div = t('div');

    class Panel {
        constructor({ runtime }) {
            this.runtime = runtime;
            this.hostNode = null;
        }

        static buildHeader() {
            return div(
                {
                    class: 'plugin_biochem-search_headerRow'
                },
                h2('BioChem Compound View')
            );
        }
        static buildBody() {
            return div(
                {
                    class: 'plugin_biochem-search_bodyRow'
                },
                [
                    div({
                        id: 'plugin_biochem-search_compoundComponentContainer',
                        class: 'plugin_biochem-search_compoundComponentContainer'
                    })
                ]
            );
        }
        static build() {
            return div(
                {
                    class: 'plugin_biochem-search_compoundPanel'
                },
                [Panel.buildHeader(), Panel.buildBody()]
            );
        }

        attach(node) {
            this.hostNode = node;
            return null;
        }

        start({ workspaceId, objectId, version }) {
            this.hostNode.innerHTML = Panel.build();
            this.runtime.send('ui', 'setTitle', 'Biochemistry Compound View');
            const compoundComponentNode = document.getElementById('plugin_biochem-search_compoundComponentContainer');
            Preact.render(
                Preact.h(CompoundComponent, {
                    workspaceId,
                    objectId,
                    version,
                    workspaceUrl: this.runtime.config('services.Workspace.url'),
                    // TODO: should be dynamic
                    token: this.runtime.service('session').getAuthToken()
                }),
                compoundComponentNode
            );
        }

        // eslint-disable-next-line class-methods-use-this
        stop() {
            return null;
        }

        detach() {
            this.hostNode.innerHTML = '';
        }
    }

    return Panel;
});
