import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./pages/Login";
import Discussions from "./pages/DiscussionsWithData";
import WritePost from "./pages/WritePost";
import Home from "./pages/Home";

// TODO: find a way to fix Login being blank after error ticket
// without forcing a refresh on page navigation

function App() {
    return (
        <Router forceRefresh={true}>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/discussions">
                    <Discussions />
                </Route>
                <Route path="/post">
                    <WritePost />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
