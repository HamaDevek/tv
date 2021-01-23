import HomePage from "./Home";
import PlaylistPage from "./Playlists";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
const { Header, Content, Footer } = Layout;
import React from "react";

const App = () => {
    return (
        <Router>
            <div>
                <Layout className="layout">
                    <Header>
                        <div className="logo" />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={["menu1"]}
                        >
                            <Menu.Item key="menu1">
                                <Link to="/">Home</Link>
                            </Menu.Item>
                            <Menu.Item key="menu2">
                                <Link to="/playlist">Playlists</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content
                        style={{
                            padding: "0 50px",
                            minHeight: "calc(100vh - 190px)"
                        }}
                    >
                        <Switch>
                            <Route path="/" exact component={HomePage} />
                            <Route path="/playlist" component={PlaylistPage} />
                        </Switch>
                    </Content>
                    <div style={{ height: "100px" }}></div>

                    <Footer
                        style={{
                            textAlign: "center",
                            position: "fixed",
                            left: "0",
                            bottom: "0",
                            width: "100%"
                        }}
                    >
                        ©{new Date().getFullYear()} Created by WT
                    </Footer>
                </Layout>
            </div>
        </Router>
    );
};

export default App;
