import React from 'react';
import {BrowserRouter} from 'react-router-dom';
const isServer = typeof window === 'undefined';

export default App => {
//const App = () => {
  return class AppWithReactRouter extends React.Component {
    static async getStaticProps(appContext) {
      console.log(appContext);
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
      if (isServer) {
        const {StaticRouter} = require('react-router');
        console.log('the props', this.props);
        console.log('the context', this.context);
        //location={this.props.originalUrl}
        //context={this.props.context}
        return (
          <StaticRouter
            location='/'
            context={{}}
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
