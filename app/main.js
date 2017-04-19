import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import BoardContainer from './components/boardContainer';
import tilesConfig from './constants/tilesConfig';
import './styles/appStyles.less';

class App extends PureComponent {
   render(){
   	 return <div className="app-container"><BoardContainer tilesConfig={tilesConfig}/></div>
   }
}

ReactDOM.render(<App />, document.getElementById('content'));
