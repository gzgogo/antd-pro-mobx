import React from 'react';
import { Table, Card } from 'antd';

class DataTable extends React.Component {
  createColumns() {
    const columns = [{
      title: '时间',
      dataIndex: 'time',
      key: 'time'
    }, {
      title: '曝光量',
      dataIndex: 'impression',
      key: 'impression'
    }, {
      title: '点击率',
      dataIndex: 'ctr',
      key: 'ctr'
    }, {
      title: '取量',
      dataIndex: 'data',
      key: 'data'
    }];

    return columns;
  }

  render() {
    const { data } = this.props;

    return (
      <Card bordered={false}>
        <Table
          title={() => ('数据详细')}
          columns={this.createColumns()}
          dataSource={data}
          rowKey="time"
        />
      </Card>
    );
  }
}

export default DataTable;
