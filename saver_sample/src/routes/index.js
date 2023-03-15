import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import StartScreen from '../StartScreen';
import Home from '../components/Home';
import RoomMatch from '../components/RoomMatch';
import RoomPassword from '../components/RoomPassword';
import CPUBattle from '../components/CPUBattle';
import Battle from '../components/Battle';
import Result from '../components/Result';


const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={StartScreen} />
        <Route path="/home" component={Home} />
        <Route path="/room-match" component={RoomMatch} />
        <Route path="/room-password" component={RoomPassword} />
        <Route path="/cpu-battle" component={CPUBattle} />
        <Route path="/battle" component={Battle} />
        <Route path="/result" component={Result} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
