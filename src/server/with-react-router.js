import React from 'react';
import {BrowserRouter} from 'react-router-dom';
const isServer = typeof window === 'undefined';

export default App => {
//const App = () => {
  return class AppWithReactRouter extends React.Component {
    static async getInitialProps(appContext) {
      const {
        ctx: {
          req: {
            originalUrl,
            locals = {},
          },
        },
      } = appContext;
      return {
        originalUrl,
        context: locals.context || {},
      };
    }

    render() {
      return (
        <BrowserRouter>
          <App {...this.props} />
        </BrowserRouter>
      );
      if (isServer) {
        const {StaticRouter} = require('react-router');
        return (
          <StaticRouter
            location={this.props.originalUrl}
            context={this.props.context}
          >
            <App {...this.props} />
          </StaticRouter>
        );
      }
      return (
        <BrowserRouter>
          <App {...this.props} />
        </BrowserRouter>
      );
    }
  };
};

//export default new App();
