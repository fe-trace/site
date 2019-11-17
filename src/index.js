import React from 'react';
import { render } from 'react-dom';
import {
    MemoryRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"; 
import './css/reset.css';
import Home from './comp/home';
import Detail from './comp/detail';

function Layout(props) {
    return (
        <div>
            <div className="header"></div>
            <div className="content">
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/:id" component={Detail} />
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

render(<Layout />, document.body);