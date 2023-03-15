// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './routes';
//import { connect } from './services/database'; // database.jsをインポート

//connect(); // database.jsを実行

ReactDOM.render(<Routes />, document.getElementById('root'));