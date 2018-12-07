import React, { Component } from 'react';
import { Form, Card, Table, Divider, Input, Select, Button, Icon, Popconfirm } from 'antd';
import ajax from 'util/api/ajax';
import EditableCell from './EditableCell';
// import { observer } from 'mobx-react';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

// @observer
class MedialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      editingKey: ''
    };
    this.columns = [
      {
        title: '撮和ID',
        dataIndex: 'id',
        key: 'id',
        editable: true
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        editable: true
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        editable: true
      },
      {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
        editable: true
      },
      {
        title: '',
        dataIndex: 'subCategory',
        key: 'subCategory',
        editable: true
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <span>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => {
                          console.log('func save: ', record);
                          this.save(form, record.key);
                        }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Popconfirm title="是否取消?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a
                    key="modify"
                    onClick={() => {
                      this.edit(record);
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

  handleSelectChange = (value) => {
    console.log(`selected ${value}`);
  };

  initial = () => {
    console.log('initial');
    this.getList();
    console.log('this.dataSource: ', this.state.dataSource);
  };

  getList = () => {
    console.log('getList');
    const arr = [];
    ajax({
      url: '/api/v1/mp',
      method: 'GET'
    })
      .then((res) => {
        console.log('res: ', res);
        if (res.code === 0) {
          if (res.data.pageNum < res.data.pages) {
            for (let i = 1; i <= res.data.pages; i++) {
              ajax({
                url: `/api/v1/mp?pageNum=${i}`,
                method: 'GET'
              })
                .then((resArr) => {
                  console.log('resArr', resArr);
                  for (let j = 0; j < resArr.data.list.length; j++) {
                    arr.push({
                      key: resArr.data.list[j].appkey,
                      id: resArr.data.list[j].appkey,
                      name: resArr.data.list[j].appName,
                      type: resArr.data.list[j].type.text,
                      subCategory: resArr.data.list[j].subCategory,
                      category: resArr.data.list[j].category
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
            // console.log('check arr', res.data.list);
            for (let i = 0; i < res.data.list.length; i++) {
              arr.push({
                key: res.data.list[i].appkey,
                id: res.data.list[i].appkey,
                name: res.data.list[i].appName,
                type: res.data.list[i].type.text,
                subCategory: res.data.list[i].subCategory,
                category: res.data.list[i].category
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
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const arr = [];
        const appName = values.appName === undefined ? '' : values.appName;
        const type = values.type === 'miniProgram' ? 0 : 1;
        ajax({
          url: `/api/v1/mp?mpName=${appName}&type=${type}`,
          method: 'GET'
        })
          .then((res) => {
            console.log('res: ', res);
            if (res.code === 0) {
              if (res.data.pageNum < res.data.pages) {
                for (let i = 1; i <= res.data.pages; i++) {
                  ajax({
                    url: `/api/v1/mp?mpName=${appName}&type=${type}&pageNum=${i}`,
                    method: 'GET'
                  })
                    .then((resArr) => {
                      console.log('resArr', resArr);
                      for (let j = 0; j < resArr.data.list.length; j++) {
                        arr.push({
                          key: resArr.data.list[j].appkey,
                          id: resArr.data.list[j].appkey,
                          name: resArr.data.list[j].appName,
                          type: resArr.data.list[j].type.text,
                          subCategory: resArr.data.list[j].subCategory,
                          category: resArr.data.list[j].category
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
                    key: res.data.list[i].appkey,
                    id: res.data.list[i].appkey,
                    name: res.data.list[i].appName,
                    type: res.data.list[i].type.text,
                    subCategory: res.data.list[i].subCategory,
                    category: res.data.list[i].category
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

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  edit(record) {
    console.log('chack edit: ', record);
    // this.setState({
    //   editingKey: key
    // });
    this.props.history.push({ pathname: '/project/mediamgr/medialist/MediaListModify', state: { name: record.name } });
    // window.location.href = '/project/mediamgr/medialist/modify';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.state;
    // console.log('dataSource: ', this, dataSource, this.state.dataSource);

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
      console.log('dataIndex: ', dataIndex);
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
    // console.log('main component log: ', this, this.props);
    return (
      <div>
        <Card bordered={false}>
          <h2>小程序列表</h2>
          <Divider />
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            style={{ margin: '40px 0 0 0', maxWidth: 'initial' }}
          >
            <Form.Item label="小程序名称">
              {getFieldDecorator('appName', {
                rules: [
                  {
                    min: 4,
                    max: 30,
                    message: '请输入包含4-30个字符的小程序名称！'
                  }
                ]
              })(<Input placeholder="请输入小程序名称" />)}
            </Form.Item>
            <Form.Item label="类别">
              {
                getFieldDecorator('type', {
                  initialValue: 'miniProgram'
                }
                )(
                  <Select
                    onChange={this.handleSelectChange}
                    style={{ width: 160 }}
                  >
                    <Select.Option value="miniProgram">小程序</Select.Option>
                    <Select.Option value="miniGame">小游戏</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                查询
              </Button>
            </Form.Item>
          </Form>
          <Card bordered={false}>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push({ pathname: '/project/mediamgr/createmp' });
                // this.props.location.pathname = '/project/mediamgr/createmp';
              }}
            >
              <Icon type="plus" />
              新建
            </Button>
          </Card>
          <Table
            components={components}
            columns={columns}
            dataSource={dataSource}
          />
        </Card>
      </div>
    );
  }
}

export default Form.create()(MedialList);
