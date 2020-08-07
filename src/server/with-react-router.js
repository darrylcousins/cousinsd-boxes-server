import React from 'react';
import {BrowserRouter} from 'react-router-dom';
const isServer = typeof window === 'undefined';

function WithApp(App) {
//const App = () => {
  return class AppWithReactRouter extends React.Component {
    static async getInitialProps(appContext) {
      //console.log(appContext);
      const {
        ctx: {
          req: {
            originalUrl,
            locals = {},
          },
        },
      } = appContext;
      console.log('original url:', originalUrl);
      console.log('locals:', locals.context);
      return {
        originalUrl,
        context: locals.context || {},
      };
    }

    render() {
      if (isServer) {
        const {StaticRouter} = require('react-router');
        //console.log('the props', this.props);
        //console.log('the context', this.context);
        //location={this.props.originalUrl}
        //context={this.props.context}
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
export default WithApp;
