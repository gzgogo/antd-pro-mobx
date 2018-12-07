import React, { Component } from 'react';
import { getADList, postadState } from 'util/api';
import { Link } from 'react-router-dom';
import {
  Form,
  Card,
  Table,
  Divider,
  Input,
  Select,
  Button,
  Row,
  Col,
  Icon,
  Popconfirm,
  Switch,
  message
} from 'antd';
import ajax from 'util/api/ajax';
import EditableCell from './EditableCell';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

function handleSelectChange(value) {
  console.log(`selected ${value}`);
}

class ADList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      dataSource: []
    };
    this.columns = [
      {
        title: '广告位ID',
        dataIndex: 'adKey',
        key: 'adKey'
      },
      {
        title: '小程序',
        dataIndex: 'appName',
        key: 'appName'
      },
      {
        title: '广告位名称',
        dataIndex: 'adName',
        key: 'adName'
      },
      {
        title: '广告位类型',
        dataIndex: 'type',
        key: 'type',
        loading: false,
        render: (text, record) => {
          // console.log('record? ', record);
          if (record.type === 1) {
            return <span>Banner</span>;
          } else if (record.type === 2) {
            return <span>悬窗</span>;
          } else if (record.type === 0) {
            return <span>自定义</span>;
          }
        }
      },
      {
        title: '广告位状态',
        dataIndex: 'state',
        key: 'state',
        loading: false,
        render: (text, record) => {
          console.log('record? ', record);
          return (
            <Switch
              defaultChecked={record.state === 1}
              onChange={() => {
                this.onSwitchChange(record.adId, record.state);
              }}
            />
          );
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <span>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => <a onClick={() => this.save(form, record.key)}>保存</a>}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Popconfirm title="是否取消?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a
                    key="Report"
                    onClick={() => {
                      console.log('click report: ', record);
                      this.Report(record.adId);
                    }}
                    style={{
                      color: '#1890FF'
                    }}
                  >
                    报表
                  </a>
                  <Divider key="DividerA" type="vertical" />
                  <a
                    key="modify"
                    onClick={() => {
                      console.log('修改');
                      this.props.history.push({ pathname: '/project/mediamgr/adlist/ADListModify', state: { adId: record.adId } });
                      // window.location.href = '/project/mediamgr/adlist/modify';
                    }}
                    style={{
                      color: '#1890FF'
                    }}
                  >
                    修改
                  </a>
                </span>
              )}
            </span>
          );
        }
      }
    ];
    this.initial();
  }

  initial = () => {
    this.getList();
  };

  onSwitchChange = async (id, state) => {
    console.log('onSwitchChange: ', id, state);
    state === 1 ? state = 0 : state = 1;
    const res = await postadState(id, state);
    console.log('res: ', res);
    if (res.code === 0) {
      message.success('该条状态修改成功！');
      this.initial();
    } else {
      message.error('该条状态修改失败！');
    }
  }

  getList = async (params) => {
    console.log('params: ', params);
    // let data;
    // if (params !== '') {
    //   data = params;
    // }
    const arr = [];
    const res = await getADList();
    console.log('getADList: ', res);
    if (res.code === 0) {
      console.log('res: ', res);
      if (res.data.pageNum < res.data.pages) {
        for (let i = 1; i <= res.data.pages; i++) {
          console.log('i: ', i);
          ajax({
            url: `/api/v1/ad?pageNum=${i}`,
            method: 'GET'
          })
            .then((thenRes) => {
              console.log('thenRes: ', thenRes);
              for (let j = 0; j < thenRes.data.list.length; j++) {
                arr.push({
                  key: thenRes.data.list[j].adKey,
                  adId: thenRes.data.list[j].adId,
                  adKey: thenRes.data.list[j].adKey,
                  adName: thenRes.data.list[j].adName,
                  appName: thenRes.data.list[j].appName,
                  company: thenRes.data.list[j].company,
                  imageUrl: thenRes.data.list[j].imageUrl,
                  state: thenRes.data.list[j].state.code,
                  type: thenRes.data.list[j].type.code
                });
              }
              this.setState({
                dataSource: arr
              });
              console.log('dataSource: ', this.state.dataSource);
            })
            .catch((error) => {
              console.log('error: ', error);
            });
        }
      } else if (res.data && res.data.list && res.data.list.length > 0) {
        for (let j = 0; j < res.data.list.length; j++) {
          arr.push({
            key: res.data.list[j].adKey,
            adId: res.data.list[j].adId,
            adKey: res.data.list[j].adKey,
            adName: res.data.list[j].adName,
            appName: res.data.list[j].appName,
            company: res.data.list[j].company,
            imageUrl: res.data.list[j].imageUrl,
            state: res.data.list[j].state.code,
            type: res.data.list[j].type.code
          });
        }
        this.setState({
          dataSource: arr
        });
        console.log('dataSource: ', this.state.dataSource);
      } else {
        this.setState({
          dataSource: []
        });
      }
    }
  };

  handleSubmit = (e) => {
    console.log(e);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const arr = [];
        const adName = values.adName === undefined ? '' : values.adName;
        const appName = values.appName === undefined ? '' : values.appName;
        let type;
        if (values.type === '请选择') {
          type = '';
        } else if (values.type === 'banner') {
          type = 1;
        } else if (values.type === 'xuanChuang') {
          type = 2;
        } else if (values.type === 'customize') {
          type = 0;
        }
        ajax({
          url: `/api/v1/ad?adName=${adName}&appName=${appName}&type=${type}`,
          method: 'GET'
        })
          .then((res) => {
            console.log('res: ', res);
            if (res.code === 0) {
              if (res.data.pageNum < res.data.pages) {
                for (let i = 1; i <= res.data.pages; i++) {
                  ajax({
                    url: `/api/v1/ad?adName=${adName}&appName=${appName}&type=${type}&pageNum=${i}`,
                    method: 'GET'
                  })
                    .then((resArr) => {
                      console.log('resArr', resArr);
                      for (let j = 0; j < resArr.data.list.length; j++) {
                        arr.push({
                          key: resArr.data.list[j].adKey,
                          adId: resArr.data.list[j].adId,
                          adKey: resArr.data.list[j].adKey,
                          adName: resArr.data.list[j].adName,
                          appName: resArr.data.list[j].appName,
                          company: resArr.data.list[j].company,
                          imageUrl: resArr.data.list[j].imageUrl,
                          state: resArr.data.list[j].state.code,
                          type: resArr.data.list[j].type.code
                        });
                      }
                      this.setState({
                        dataSource: arr
                      });
                      // console.log('check arr', resArr.data.list);
                    })
                    .catch((error) => {
                      console.log('error', error);
                    });
                }
                console.log('then log arr: ', arr);
              } else if (res.data && res.data.list && res.data.list.length > 0) {
                console.log('check arr', res.data.list);
                for (let i = 0; i < res.data.list.length; i++) {
                  arr.push({
                    key: res.data.list[i].adKey,
                    adId: res.data.list[i].adId,
                    adKey: res.data.list[i].adKey,
                    adName: res.data.list[i].adName,
                    appName: res.data.list[i].appName,
                    company: res.data.list[i].company,
                    imageUrl: res.data.list[i].imageUrl,
                    state: res.data.list[i].state.code,
                    type: res.data.list[i].type.code
                  });
                }
                this.setState({
                  dataSource: arr
                });
                // console.log('check this.state.dataSource', this.state.dataSource);
              } else {
                this.setState({
                  dataSource: []
                });
              }
              console.log('last mp log: ', this.state.dataSource);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  Report = (adId) => {
    console.log('Report: ', adId, window.location);
    this.props.history.push({ pathname: '/project/mediamgr/adReport', state: { adId } });
    // window.location.href = '/project/mediamgr/adReport';
    // this.props.router.push('/project/mediamgr/adReport');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      const { dataIndex } = col;
      let inputType;
      if (col.dataIndex === 'type') {
        inputType = 'select';
      } else if (col.dataIndex === 'category') {
        inputType = 'category';
      } else if (col.dataIndex === 'subCategory') {
        inputType = 'subCategory';
      } else {
        inputType = 'text';
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType,
          dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });
    console.log('main component log: ', this, this.props);
    return (
      <div>
        <Card bordered={false}>
          <Form layout="inline" onSubmit={this.handleSubmit} style={{ maxWidth: '100%' }}>
            <Row type="flex" justify="center">
              <Col span={7}>
                <Form.Item label="广告位名称">
                  {getFieldDecorator('adName', {
                    rules: [
                      {},
                      {
                        required: false,
                        message: 'Please input your MiniproGram name!'
                      }
                    ]
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="小程序名称">
                  {getFieldDecorator('appName', {
                    rules: [
                      {},
                      {
                        required: false,
                        message: 'Please input your MiniproGram name!'
                      }
                    ]
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="广告位类型">
                  {
                    getFieldDecorator('type', {
                      initialValue: '请选择'
                    })(
                      <Select
                        onChange={handleSelectChange}
                        style={{ width: 170 }}
                      >
                        <Select.Option value="banner">Banner</Select.Option>
                        <Select.Option value="xuanChuang">悬窗</Select.Option>
                        <Select.Option value="customize">自定义</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false}>
          <Link to={'/project/mediamgr/createadp'}>
            <Button
              type="primary"
            >
              <Icon type="plus" />
              新建
            </Button>
          </Link>
        </Card>
        <Card bordered={false}>
          <Table components={components} columns={columns} dataSource={dataSource} />
        </Card>
      </div>
    );
  }
}

export default Form.create()(ADList);
