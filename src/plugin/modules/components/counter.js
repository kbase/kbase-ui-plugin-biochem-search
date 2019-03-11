define(['preact'], (Preact) => {
    /* strict mode
     * We always set strict mode with the following magic javascript
     * incantation.
     */
    'use strict';

    const { Component, h } = Preact;

    class CounterComponent extends Component {
        renderCounter() {
            return h(
                'div',
                {
                    border: '1px solid red',
                    padding: '4px',
                    margin: '4px'
                },
                h('p', null, 'So, here we are inside of the counter component renderer'),
                h('p', null, 'We are counting by : ' + this.state.countingBy),
                h(
                    'p',
                    null,
                    `Just click the button in increment the counter ${this.state.counter}, this shows state change`
                ),
                h(
                    'button',
                    {
                        type: 'button',
                        onClick: () => {
                            this.increment();
                        }
                    },
                    'Click Me!'
                )
            );
        }

        increment() {
            this.setState({ counter: this.state.counter + this.props.countingBy });
        }

        render() {
            return h('div', null, h('p', null, 'Hi'), this.renderCounter());
        }
        componentDidMount() {
            this.setState({ counter: 0 });
        }
    }

    return CounterComponent;
});
