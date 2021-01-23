import {
    Layout,
    Row,
    Col,
    Card,
    Table,
    Space,
    notification,
    Button,
    Input,
    Tooltip,
    Modal
} from "antd";
import { DeleteFilled } from "@ant-design/icons";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    FrownOutlined,
    SmileOutlined,
    FileAddOutlined,
    EditOutlined
} from "@ant-design/icons";

const { Content } = Layout;
const openNotificationFailed = message => {
    notification.open({
        message: "Error",
        description: `${message}`,
        icon: <FrownOutlined style={{ color: "#f5222d" }} />
    });
};
const openNotificationSuccess = message => {
    notification.open({
        message: "Successful",
        description: `${message}`,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />
    });
};
const Playlist = () => {
    const columns = [
        {
            title: "ID",
            key: "key",
            dataIndex: "key"
        },
        {
            title: "Playlist Name",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "URL",
            dataIndex: "url",
            key: "url"
            // render: (text) => <a>{text}</a>,
        },
        {
            title: "Timeout",
            dataIndex: "timeout",
            key: "timeout"
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <div>
                    <Space size="middle">
                        <Tooltip title="Delete Playlist">
                            <Button
                                type="primary"
                                danger
                                onClick={e => {
                                    axios
                                        .delete(
                                            `${window.location.origin}/api/channels/delete/${record.key}`
                                        )
                                        .then(res => {
                                            if (res.status === 200) {
                                                openNotificationSuccess(
                                                    res.data["message"]
                                                );
                                                setData([
                                                    ...data.filter(function(
                                                        ele
                                                    ) {
                                                        return (
                                                            ele.key !==
                                                            record.key
                                                        );
                                                    })
                                                ]);
                                            } else {
                                                openNotificationFailed(
                                                    res.data["message"]
                                                );
                                            }
                                        })
                                        .catch(error => {
                                            console.error(error);
                                        });
                                }}
                                shape="circle"
                                icon={<DeleteFilled />}
                            />
                        </Tooltip>
                    </Space>

                    <Space size="middle" style={{ marginLeft: "10px" }}>
                        <Tooltip title="Edit">
                            <Button
                                onClick={e => showModalEdit(record)}
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                            />
                        </Tooltip>
                    </Space>
                </div>
            )
        }
    ];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [formData, setFormData] = useState({ url: "", timeout: 3 });

    const [visibleEdit, setVisibleEdit] = useState(false);
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);

    const showModalEdit = row => {
        setVisibleEdit(true);
        setFormData({
            id: row.key,
            name: row.name,
            url: row.url,
            timeout: row.timeout
        });
    };

    const showModal = () => {
        setVisible(true);
        setFormData({});
    };

    const handleOkEdit = () => {
        setConfirmLoading(true);
        axios
            .post(
                `${window.location.origin}/api/channels/edit`,
                {
                    id: `${formData.id}`,
                    name: `${formData.name}`,
                    url: `${formData.url}`,
                    timeout: `${formData.timeout}`
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            )
            .then(res => {
                console.log(res.data);
                if (res.status === 200) {
                    if (res.data["result"].user_info.auth === 1) {
                        openNotificationSuccess("Update Playlist Successfull");
                        setVisible(false);
                        const index = data.findIndex(
                            el => el.key === res.data["playlist"].key
                        );
                        data[index] = {
                            key: res.data["playlist"].key,
                            name: res.data["playlist"].name,
                            url: res.data["playlist"].url,
                            timeout: res.data["playlist"].timeout
                        };
                        setData([...data]);
                        setVisibleEdit(false);

                        // setFormData({});
                    } else {
                        openNotificationFailed("Error");
                    }
                }
                if (res.status === 404) {
                    openNotificationFailed(res.status["message"]);
                }
            })
            .catch(error => {
                console.error(error);
            });
        setConfirmLoading(false);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        axios
            .post(
                `${window.location.origin}/api/get`,
                {
                    url: `${formData.url}`,
                    timeout: `${formData.timeout}`
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            )
            .then(res => {
                if (res.status === 200) {
                    if (res.data["result"].user_info.auth === 1) {
                        setData([
                            ...data,
                            {
                                key: res.data["playlist"].key,
                                name: res.data["playlist"].name,
                                url: res.data["playlist"].url,
                                timeout: res.data["playlist"].timeout
                            }
                        ]);
                        openNotificationSuccess("Added Playlist Successfull");
                        setVisible(false);
                        setFormData({ url: "", timeout: 3 });
                    } else {
                        openNotificationFailed("Authentication Faild");
                    }
                }
            })
            .catch(error => {
                openNotificationFailed(error.response.data["message"]);
            });
        setConfirmLoading(false);
    };

    const handleCancelEdit = () => {
        setVisibleEdit(false);
    };
    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${window.location.origin}/api/channels`)
            .then(res => {
                if (res.status === 200) {
                    setData(res.data["data"]);
                }
            })
            .catch(error => {
                console.error(error);
            });
        setLoading(false);
    }, []);

    return (
        <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
        >
            <Row justify="space-between">
                <Col span={24}>
                    <Card title="List Channels">
                        <div>
                            <Tooltip title="New">
                                <Button
                                    type="primary"
                                    shape="round"
                                    onClick={showModal}
                                    icon={<FileAddOutlined />}
                                >
                                    Add New Playlist
                                </Button>
                            </Tooltip>
                            <Modal
                                title="Add New Playlist"
                                visible={visible}
                                onOk={handleOk}
                                confirmLoading={confirmLoading}
                                onCancel={handleCancel}
                            >
                                <Input
                                    value={formData.url}
                                    onChange={e => {
                                        setFormData({
                                            url: e.target.value,
                                            timeout: formData.timeout
                                        });
                                    }}
                                    placeholder="M3U Link"
                                ></Input>
                                <div style={{ height: "10px" }}></div>

                                <Input
                                    value={formData.timeout}
                                    onChange={e => {
                                        setFormData({
                                            url: formData.url,
                                            timeout: e.target.value
                                        });
                                    }}
                                    placeholder="Timeout"
                                    type="number"
                                ></Input>
                            </Modal>
                            <Modal
                                title="Edit New Playlist"
                                visible={visibleEdit}
                                onOk={handleOkEdit}
                                confirmLoading={confirmLoadingEdit}
                                onCancel={handleCancelEdit}
                            >
                                <Input
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData({
                                            id: formData.id,
                                            name: e.target.value,
                                            url: formData.url,
                                            timeout: formData.timeout
                                        });
                                    }}
                                    placeholder="Name"
                                ></Input>
                                <div style={{ height: "10px" }}></div>

                                <Input
                                    value={formData.url}
                                    onChange={e => {
                                        setFormData({
                                            id: formData.id,
                                            name: formData.name,
                                            url: e.target.value,
                                            timeout: formData.timeout
                                        });
                                    }}
                                    placeholder="M3U Link"
                                ></Input>
                                <div style={{ height: "10px" }}></div>
                                <Input
                                    value={formData.timeout}
                                    onChange={e => {
                                        setFormData({
                                            id: formData.id,
                                            name: formData.name,
                                            url: formData.url,
                                            timeout: e.target.value
                                        });
                                    }}
                                    placeholder="Timeout"
                                    type="number"
                                ></Input>
                            </Modal>
                        </div>
                        <div style={{ height: "20px" }}></div>

                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            loading={loading}
                        />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};
export default Playlist;
