import axios from "axios";
import { useState, useEffect } from "react";
import TableNew from "./TableNew";
import {
    Layout,
    Row,
    Col,
    Card,
    Input,
    notification,
    Collapse,
    Button
} from "antd";
import { v4 as uuidv4 } from "uuid";
import dateFormat from "dateformat";
import {
    SmileOutlined,
    FrownOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import React from "react";
import ReactDOM from "react-dom";

const { Content } = Layout;
const { Search } = Input;
const { Panel } = Collapse;

const Home = () => {
    const openNotificationFailed = er => {
        notification.open({
            message: "Error Loading",
            description: `${er}`,
            icon: <FrownOutlined style={{ color: "#f5222d" }} />
        });
    };
    const openNotificationSuccess = () => {
        notification.open({
            message: "Success Loading",
            description: "Channels Loading successfully ",
            icon: <SmileOutlined style={{ color: "#108ee9" }} />
        });
    };
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [search, setSearch] = useState("");
    const [timeout, setTimeout] = useState(3);
    const [playlistinfo, setPlaylistinfo] = useState([]);
    useEffect(() => {}, [playlistinfo]);
    const onClickHandling = e => {
        setLoading(true);
        axios
            .post(
                `${window.location.origin}/api/get_api`,
                {
                    url: `${e}`,
                    timeout: `${timeout}`
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            )
            .then(res => {
                if (res.status === 200) {
                    if (res.data["user_info"]["auth"] === 1) {
                        // let data = [];
                        let url = `${res.data["server_info"]["server_protocol"]}://${res.data["server_info"]["url"]}:${res.data["server_info"]["port"]}`;
                        let username = `${res.data["user_info"]["username"]}`;
                        let password = `${res.data["user_info"]["password"]}`;
                        playlistinfo.push(res.data["user_info"]);

                        Object.values(res.data["available_channels"]).forEach(
                            ech => {
                                if (ech.stream_type === "live") {
                                    dataTable.push({
                                        key: `${url}/${username}/${password}/${ech.stream_id}`,
                                        name: ech.name,
                                        host: `${res.data["server_info"]["url"]}:${res.data["server_info"]["port"]}`,
                                        category: ech.category_name,
                                        url: `${url}/${username}/${password}/${ech.stream_id}`,
                                        status: "Unknowen",
                                        loading: false,
                                        timeout: timeout
                                    });
                                } else if (ech.stream_type === "movie") {
                                    dataTable.push({
                                        key: `${url}/movie/${username}/${password}/${ech.stream_id}.${ech.container_extension}`,
                                        name: ech.name,
                                        host: `${res.data["server_info"]["url"]}:${res.data["server_info"]["port"]}`,
                                        category: ech.category_name,
                                        url: `${url}/movie/${username}/${password}/${ech.stream_id}.${ech.container_extension}`,
                                        status: "Unknowen",
                                        loading: false,
                                        timeout: timeout
                                    });
                                } else if (ech.stream_type === "created_live") {
                                }
                            }
                        );

                        setDataTable([...dataTable]);
                        setSearch("");
                        openNotificationSuccess();
                    } else {
                        openNotificationFailed("Authentication Faild");
                    }
                }
                if (res.status === 404) {
                    openNotificationFailed(res.status["message"]);
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);

                console.error(error);
            });
    };
    return (
        <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
        >
            <Row justify="space-between">
                <Col span={12}>
                    <Card title="Add URL">
                        <Button
                            type="primary"
                            shape="round"
                            icon={<DownloadOutlined />}
                            block
                            onClick={e => {
                                axios
                                    .get("http://localhost/api/channels")
                                    .then(res => {
                                        if (res.status === 200) {
                                            res.data["data"].forEach(el => {
                                                onClickHandling(el.url);
                                            });
                                        }
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}
                        >
                            Load Playlists
                        </Button>
                        <div style={{ height: "20px" }}></div>

                        <Input
                            placeholder="Timeout"
                            size="large"
                            value={timeout}
                            onChange={e => setTimeout(e.target.value)}
                        />
                        <div style={{ height: "20px" }}></div>

                        <Search
                            value={search}
                            placeholder="Input M3U URL"
                            enterButton="Search"
                            onChange={e => setSearch(e.target.value)}
                            size="large"
                            onSearch={onClickHandling}
                            loading={loading}
                        />
                    </Card>
                </Col>
                <Col span={11}>
                    <Card title="Playlists">
                        <Collapse>
                            {playlistinfo.map(el => (
                                <Panel header={`${el.username}`} key={uuidv4()}>
                                    <p>{`Username : ${el.username}`}</p>
                                    <p>{`Password : ${el.password}`}</p>
                                    <p
                                        style={{
                                            color:
                                                el.active_cons >
                                                el.max_connections
                                                    ? "volcano"
                                                    : "#69c0ff"
                                        }}
                                    >{`Connection : ${el.active_cons} / ${el.max_connections}`}</p>
                                    <p>{`Status : ${el.status}`}</p>
                                    <p>{`Created At : ${dateFormat(
                                        new Date(
                                            el.created_at * 1000
                                        ).toDateString(),
                                        "mmmm dS, yyyy"
                                    )}`}</p>
                                    <p>{`Expire At : ${dateFormat(
                                        new Date(
                                            el.exp_date * 1000
                                        ).toDateString(),
                                        "mmmm dS, yyyy"
                                    )}`}</p>
                                </Panel>
                            ))}
                        </Collapse>
                    </Card>
                </Col>
                <Col span={24}>
                    <div style={{ height: "20px" }}></div>
                </Col>

                <Col span={24}>
                    <Card title="List Channels">
                        <TableNew datas={dataTable} />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};
export default Home;
