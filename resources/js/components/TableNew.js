import { Table, Tag, Button, notification, Input } from "antd";
import React from "react";
import { FileSearchOutlined, SmileOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
const { TextArea } = Input;

const TableNew = ({ datas }) => {
  const openNotification = () => {
    notification.open({
      message: "Saved",
      description: "Saved All Selected Row",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const openNotificationLinkCopy = (link) => {
    notification.open({
      message: "Copy Clipboard",
      description: "Copied : " + link,
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };
  const [dataTable, setDataTable] = useState([]);
  // const [hosts, setHosts] = useState([]);
  const [copedText, setCopedText] = useState("");
  useEffect(() => {
    setDataTable(datas);
  }, [datas]);
  var groupBy = function (data, key) {
    let cts = new Set();
    data.forEach((el) => {
      cts.add(el[key]);
    });
    let newData = [];
    cts.forEach((el) => newData.push({ text: el, value: el }));
    return newData;
  };
  //   groupBy(datas, "category");
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sortType: "string",
      filters: groupBy(datas, "category"),
      filterMultiple: true,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Channel Name",
      dataIndex: "name",
      key: "name",
      sortType: "string",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Host URL",
      dataIndex: "host",
      key: "host",
      sortType: "string",
      filters: groupBy(datas, "host"),
      filterMultiple: true,
      onFilter: (value, record) => record.host.indexOf(value) === 0,
      sorter: (a, b) => a.host.localeCompare(b.host),
    },

    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      sortType: "string",
      render: (text, record) => (
        <p
          onClick={(e) => {
            openNotificationLinkCopy(text);
            navigator.clipboard.writeText(text);
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Failed",
          value: "Failed",
        },
        {
          text: "Unknowen",
          value: "Unknowen",
        },
      ],
      filterMultiple: true,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        return (
          <>
            <Tag
              color={
                status === "Failed"
                  ? "volcano"
                  : status === "Active"
                  ? "green"
                  : "geekblue"
              }
            >
              {status}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        return (
          <>
            <Button
              loading={record.loading}
              type="primary"
              shape="circle"
              onClick={(e) =>
                onClickHandling(e, index, record.url, record.timeout)
              }
              icon={<FileSearchOutlined />}
              size="large"
            />
          </>
        );
      },
    },
  ];
  const [selectedRow, setSelectedRow] = React.useState([]);
  const onSelectChange = (row) => {
    setSelectedRow({ row });
  };
  const onClickHandling = (e, index, url, timeout) => {
    datas[index].loading = true;
    setDataTable([...datas]);
    axios
      .post(`${window.location.origin}/api/test`, {
        id: url,
        time: timeout,
      })
      .then((res) => {
        if (res.data === "a") {
          datas[index].status = "Active";
        } else if (res.data === "f") {
          datas[index].status = "Failed";
        } else {
          datas[index].status = "Unknowen";
        }
        datas[index].loading = false;
        setDataTable([...datas]);
      })
      .catch((error) => {
        console.error(error);
        datas[index].loading = false;
        setDataTable([...datas]);
      });
  };
  const onClickHandlingScan = (e) => {
    if (selectedRow.length !== 0) {
      selectedRow["row"]?.forEach((el) => {
        datas.forEach((dt, index) => {
          if (dt.key === el) {
            onClickHandling(e, index, dt.url, dt.timeout);
          }
        });
      });
    }
  };
  const rowSelection = {
    selectedRow,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL],
  };
  return (
    <div>
      <Button
        type="primary"
        style={{ marginRight: "10px" }}
        loading={false}
        onClick={onClickHandlingScan}
      >
        Scan
      </Button>
      <Button
        type="primary"
        style={{
          marginRight: "10px",
          backgroundColor: "#eb2f96",
          borderColor: "#eb2f96",
        }}
        onClick={(e) => {
          let txt = "";
          setCopedText(txt);
          if (selectedRow.length !== 0) {
            selectedRow["row"]?.forEach((el) => {
              datas.forEach((dt, index) => {
                if (dt.key === el) {
                  txt = txt + "#EXTINF:-1," + dt.name + "\n";
                  txt = txt + el + "\n";
                }
              });
            });
            const copys = document.getElementById("copy");
            copys.value = txt;
            setCopedText(txt);
            copys.select();
            document.execCommand("copy");
            openNotification();
          }
        }}
      >
        Save As M3U
      </Button>
      <Button
        type="primary"
        danger
        style={{
          marginRight: "10px",
          backgroundColor: "#eb2f96",
          borderColor: "#eb2f96",
        }}
        onClick={(e) => {
          let txt = "";
          setCopedText(txt);
          if (selectedRow.length !== 0) {
            selectedRow["row"]?.forEach((el) => {
              datas.forEach((dt, index) => {
                if (dt.key === el) {
                  txt = txt + dt.name + "\n";
                }
              });
            });
            const copys = document.getElementById("copy");
            copys.value = txt;
            setCopedText(txt);
            copys.select();
            document.execCommand("copy");
            openNotification();
          }
        }}
      >
        Copy
      </Button>
      <Button
        type="primary"
        danger
        onClick={(e) => {
          setDataTable([]);
          window.location.reload(false);
        }}
      >
        Clear Table
      </Button>
      <div style={{ height: "20px" }}></div>
      <Input.Search
        allowClear
        size="large"
        placeholder="Channel Name"
        onSearch={(e) => {
          setDataTable(
            datas.filter((channel) =>
              channel.name.toLowerCase().includes(e.toLowerCase())
            )
          );
        }}
      />
      <div style={{ height: "20px" }}></div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataTable}
        onChange={onSelectChange}
        pagination={false}
      />
      <TextArea
        value={copedText}
        id="copy"
        rows={1}
        autoSize={{ minRows: 1, maxRows: 1 }}
      />
    </div>
  );
};

export default TableNew;
