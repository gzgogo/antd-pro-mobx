import React, { Component } from 'react';
import { Breadcrumb, Card, Form, Icon, Input, Button, Select, Table, Divider } from 'antd';
import './index.less';

const { Option } = Select;

const columns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '类型',
  dataIndex: 'type',
  key: 'type'
}, {
  title: '小程序',
  dataIndex: 'miniProgram',
  key: 'miniProgram'
}, {
  title: '目标UV',
  dataIndex: 'aims',
  key: 'aims'
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status'
}, {
  title: '操作',
  key: 'action',
  render: (/* text, record */) => (
    <span>
      <a href="/DataReport">报表</a>
      <Divider type="vertical" />
      <a href="">修改</a>
    </span>
  )
}
];

const data = [
  {
    key: 'a',
    name: '计划名称',
    type: '存量',
    miniProgram: '黑咖相机',
    aims: 10000,
    status: '存量中'
  }
];


class ConversionPlan extends Component {
  // constructor(props) {
  //   super(props);
  // }

  hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])

  handleSubmit = (e) => {
    e.preventDefault();
  }

  createNewConversionPlan = (e) => {
    console.log(e);
    this.props.history.push('/createExchangePlan');
  }

  render() {
    return (
      <div style={{ padding: 28 }} >
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>推广管理</Breadcrumb.Item>
            <Breadcrumb.Item>推广计划</Breadcrumb.Item>
          </Breadcrumb>
          <h3 style={{ marginTop: 16 }}>推广计划</h3>
          <Divider />
          <Form layout="inline" onSubmit={this.handleSubmit} style={{ marginTop: 45 }}>
            <Form.Item
              label="推广计划名称:"
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="类型"
            >
              <Select defaultValue="save">
                <Option value="save">存量</Option>
                <Option value="get">取量</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
              >
                    查询
              </Button>
            </Form.Item>
          </Form>
          <Card bordered={false} />
          <Button
            type="primary"
            onClick={this.createNewConversionPlan}
          >
            <Icon type="plus" />
                新建
          </Button>
          <Table columns={columns} dataSource={data} style={{ marginTop: 45 }} />
        </Card>
      </div>
    );
  }
}

export default Form.create()(ConversionPlan);
