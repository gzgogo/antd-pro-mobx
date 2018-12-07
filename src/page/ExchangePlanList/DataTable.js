import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Divider, Popover } from 'antd';

class DataTable extends React.Component {
  createColumns() {
    const { onTerminate } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/project/exchangemgr/datareport/${record.id}`}>{text}</Link>
    }, {
      title: '小程序',
      dataIndex: 'media.name',
      key: 'media.name'
    }, {
      title: 'logo',
      dataIndex: 'ad.logoImageUrl',
      key: 'ad.logoImageUrl',
      render: text => (
        <Popover content={<img width="400" src={text} alt="" />} trigger="click">
          <img width="40" height="40" src={text} alt="" />
        </Popover>
      )
    }, {
      title: '描述',
      dataIndex: 'ad.slogan',
      key: 'ad.slogan'
    }, {
      title: '状态',
      key: 'state.text',
      dataIndex: 'state.text'
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <span>
          <Link to={`/project/exchangemgr/datareport/${text}`}>报表</Link>
          <Divider type="vertical" />
          <Link to={`/project/exchangemgr/create/${text}`}>修改</Link>
          {
            (record.state || {}).code !== 3 && (
              <React.Fragment>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={() => onTerminate(text, record)}>结束</a>
              </React.Fragment>
            )
          }
        </span>
      )
    }];

    return columns;
  }

  render() {
    const { data } = this.props;

    return <Table columns={this.createColumns()} dataSource={data} rowKey="id" />;
  }
}

export default DataTable;
