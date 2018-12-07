import React, { Component } from 'react';
import OSS from 'ali-oss';
import shortid from 'shortid';
import { Input, Button, Form, Upload, Alert, Card, Icon, Modal, message } from 'antd';
import ajax from 'util/api/ajax';
import './index.css';

const alertStatusContent = [
  {
    alertStatusIndex: 0,
    message: '请提交账号资料审核',
    description: '当前账号，未进行企业信息审核认证，审核通过后，可进行广告投放及推广等操作。',
    type: 'warning',
    showIcon: true
  },
  {
    alertStatusIndex: 1,
    message: '审核中',
    description: '您提交的资料正在审核中，预计需要1个工作日，请耐心等待。',
    type: 'info',
    showIcon: true
  },
  {
    alertStatusIndex: 2,
    message: '请重新提交账号资料审核',
    description:
      '当前账号，企业信息审核未通过； 请重新提交。审核通过后，可进行广告投放及推广等操作。',
    type: 'warning',
    showIcon: true
  },
  {
    alertStatusIndex: 3,
    message: '审核已通过！',
    description: '你所提交的信息已经审核通过。如有问题，请联系审核人员或在线客服。',
    type: 'success',
    showIcon: true
  }
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const onClose = function (e) {
  console.log(e, 'I was closed.');
};

function getFileExt(filename) {
  let ext = '';
  const pos = filename.lastIndexOf('.');
  if (pos > 0) {
    ext = filename.substring(pos, filename.length);
  }

  return ext;
}

class CorporateInformation extends Component {
  constructor(props) {
    super(props);
    // this.alertStatus;
    this.state = {
      previewVisible1: false,
      previewImage1: '',
      alertStatusIndex: 0,
      visible: false,
      companyId: '',
      companyNameInupt: true,
      reSubmitInfo: '',
      res: {},
      loading1: false,
      fileList1: [],
      previewVisible2: false,
      previewImage2: '',
      loading2: false,
      fileList2: [],
      previewVisible3: false,
      previewImage3: '',
      loading3: false,
      fileList3: []
    };
    this.initial();
  }

  beforeUpload = (file) => {
    console.log('file check');
    const isJPG = file.type === 'image/jpg';
    const isJPEG = file.type === 'image/jpeg';
    if (!(isJPG || isJPEG)) {
      message.error('暂时只支持拓展名（后缀）：.jpg .jpeg 且小于500k！');
    }
    const isLt500K = file.size / 1024 / 1024 < 0.5;
    if (!isLt500K) {
      message.error('图片大小超出 500K!');
    }
    console.log('beforeUpload return: ', (isJPG || isJPEG) && isLt500K);
    return (isJPG || isJPEG) && isLt500K;
  };

  initial = () => {
    ajax({
      url: '/api/v1/company',
      method: 'GET'
    })
      .then((res) => {
        console.log('获取企业信息 res', res);
        if (res.data === null) {
          // 未提交
          console.log('未提交');
          this.setState({
            alertStatusIndex: 0
          });
        } else {
          this.setState({
            companyId: res.data.companyId
          });
          ajax({
            method: 'GET',
            url: '/api/v1/oss_sts?bucket=matrix-server'
          })
            .then((ossRes) => {
              console.log('ossRes:', ossRes);
              this.setState({
                res: ossRes.data
              });
              console.log('res, ossRes: ', res, ossRes, this.state.res);
              if (ossRes.code === 0) {
                const client = new OSS({
                  ...ossRes.data,
                  expire: ''
                });
                console.log('check res', res);
                const signatureUrlLicense = client.signatureUrl(
                  res.data.license.slice(res.data.license.match('upload').index, res.data.license.length)
                );
                const signatureUrlIdCardFront = client.signatureUrl(
                  res.data.idCardFront.slice(
                    res.data.idCardFront.match('upload').index,
                    res.data.idCardFront.length
                  )
                );
                const signatureUrlIdCardBack = client.signatureUrl(
                  res.data.idCardBack.slice(res.data.idCardBack.match('upload').index, res.data.idCardBack.length)
                );
                console.log(
                  'signatureUrl ',
                  this.state.fileList1,
                  this.state.fileList2,
                  this.state.fileList3,
                  'signatureUrlLicense= ',
                  signatureUrlLicense,
                  'signatureUrlIdCardFront= ',
                  signatureUrlIdCardFront,
                  'signatureUrlIdCardBack= ',
                  signatureUrlIdCardBack
                );
                this.setState({
                  fileList1: [
                    {
                      baseUrl: res.data.license,
                      uid: res.data.companyId,
                      name: '营业执照',
                      state: 'done',
                      url: signatureUrlLicense
                    }
                  ],
                  fileList2: [
                    {
                      baseUrl: res.data.idCardFront,
                      uid: res.data.companyId,
                      name: '法人身份证正面',
                      state: 'done',
                      url: signatureUrlIdCardFront
                    }
                  ],
                  fileList3: [
                    {
                      baseUrl: res.data.idCardBack,
                      uid: res.data.companyId,
                      name: '法人身份证反面',
                      state: 'done',
                      url: signatureUrlIdCardBack
                    }
                  ]
                });
                console.log('check filist ', this.state.fileList1, this.state.fileList2, this.state.fileList3);
              }
              if (res.data.status.code === 0) {
                // 审核中
                console.log('审核中', this.state.fileList1);
                this.setState({
                  alertStatusIndex: 1,
                  companyId: res.data.companyId,
                  companyNameInupt: false
                });
                this.props.form.setFieldsValue({
                  companyName: res.data.companyName
                });
                console.log('=> ', this.state.fileList1);
                // this.handleChange1();
              } else if (res.data.status.code === -1) {
                // 审核未通过
                console.log('审核未通过');
                this.setState({
                  alertStatusIndex: 2,
                  companyId: res.data.companyId,
                  companyNameInupt: true,
                  reSubmitInfo: res.data.commit
                });
                this.props.form.setFieldsValue({
                  companyName: res.data.companyName
                });
              } else if (res.data.status.code === 1) {
                // 审核通过
                console.log('审核通过');
                this.setState({
                  alertStatusIndex: 3,
                  companyId: res.data.companyId,
                  companyNameInupt: false
                });
                this.props.form.setFieldsValue({
                  companyName: res.data.companyName
                });
              }
            })
            .catch((error) => {
              console.log('error ', error);
            });
        }
      })
      .catch((error) => {
        console.log('获取企业信息出错', error);
        message.info('出了些状况，本次企业信息状态获取失败！');
      });
  };

  showOnSubmitModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true
    });
  };

  handleModalOk = (e) => {
    console.log(e);
    this.setState({
      visible: false
    });
    this.onSubmit(e);
  };

  handleModalCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.state.alertStatusIndex === 0 || this.state.alertStatusIndex === 2) {
          // 审核未通过 需要修改审核内容
          if (
            this.state.fileList1[0] === undefined ||
            this.state.fileList1[0].baseUrl === '' ||
            (this.state.fileList2[0] === undefined || this.state.fileList2[0].baseUrl === '') ||
            (this.state.fileList3[0] === undefined || this.state.fileList3[0].baseUrl) === ''
          ) {
            message.error('请完善审核资料！');
            return;
          }
          const data = {
            companyName: values.companyName,
            license: this.state.fileList1[0].baseUrl,
            idCardFront: this.state.fileList2[0].baseUrl,
            idCardBack: this.state.fileList3[0].baseUrl
          };
          console.log(
            'showdata: ',
            data,
            this.state.fileList1,
            this.state.fileList2,
            this.state.fileList3,
            '然后put'
          );

          ajax({
            url: '/api/v1/company',
            method: 'GET'
          })
            .then((res) => {
              console.log('res', res);
              if (res.data === null) {
                ajax({
                  url: '/api/v1/company',
                  method: 'POST',
                  data
                })
                  .then((resPost) => {
                    if (resPost.code === 0) {
                      message.success('企业信息提交成功！');
                      this.setState({
                        alertStatusIndex: 1
                      });
                    } else {
                      message.error('本次提交失败!');
                    }
                  })
                  .catch((error) => {
                    console.log('error ', error);
                  });
              } else {
                ajax({
                  url: `/api/v1/company/${this.state.companyId}`,
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data
                })
                  .then((resPut) => {
                    console.log(resPut);
                    if (resPut.code === 0) {
                      message.success('资料修改成功！');
                      this.setState({
                        alertStatusIndex: 1
                      });
                      console.log(
                        'boolean: ',
                        this.state.alertStatusIndex,
                        !(this.state.alertStatusIndex === 1 || this.state.alertStatusIndex === 3)
                      );
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    message.info('出了些状况，本次企业信息状态修改失败！');
                  });
              }
            });
        }
      }
    });
  };

  customRequest1 = (option) => {
    console.log('option', option);
    this.setState({
      loading1: true
    });
    ajax({
      url: '/api/v1/oss_sts?bucket=matrix-server',
      method: 'GET'
    })
      .then(async (res) => {
        console.log('res', res);
        this.setState({
          res: {
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            bucket: 'matrix-server',
            dir: 'upload',
            expire: res.data.expire,
            region: res.data.region,
            stsToken: res.data.stsToken
          }
        });
        console.log('res: ', this.state.res);

        if (this.state.res && res.data) {
          const client = new OSS({
            ...res.data,
            expire: ''
          });

          const fileName = `upload/${shortid.generate()}${getFileExt(option.file.name)}`;
          const result = await client.put(fileName, option.file); // await

          if (result.res && result.res.status === 200) {
            option.onSuccess(result);
            console.log('success', result);
            const signatureUrlLicense = client.signatureUrl(
              result.url.slice(result.url.match('upload').index, result.url.length)
            );
            this.setState({
              fileList1: [
                {
                  baseUrl: result.url,
                  uid: result.name,
                  name: '营业执照',
                  state: 'done',
                  url: signatureUrlLicense
                }
              ]
            });
            console.log('info => ', this.state.fileList1);
          } else {
            option.onError(result);
            console.log('onError', result);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        message.info(error);
      });

    this.setState({
      loading1: false
    });
    console.log('fileList1 ', this.state.fileList1);
  };

  customRequest2 = (option) => {
    console.log('option', option);
    this.setState({
      loading2: true
    });
    ajax({
      url: '/api/v1/oss_sts?bucket=matrix-server',
      method: 'GET'
    })
      .then(async (res) => {
        this.setState({
          res: {
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            bucket: 'matrix-server',
            dir: 'upload',
            expire: res.data.expire,
            region: res.data.region,
            stsToken: res.data.stsToken
          }
        });
        console.log('res: ', this.state.res);

        if (this.state.res && res.data) {
          const client = new OSS({
            ...res.data,
            expire: ''
          });

          const fileName = `upload/${shortid.generate()}${getFileExt(option.file.name)}`;
          const result = await client.put(fileName, option.file); // await

          if (result.res && result.res.status === 200) {
            option.onSuccess(result);
            console.log('success', result);
            const signatureUrlIdCardFront = client.signatureUrl(
              result.url.slice(result.url.match('upload').index, result.url.length)
            );
            this.setState({
              fileList2: [
                {
                  baseUrl: result.url,
                  uid: result.name,
                  name: '法人身份证正面',
                  state: 'done',
                  url: signatureUrlIdCardFront
                }
              ]
            });
            console.log('info => ', this.state.fileList2);
          } else {
            option.onError(result);
            console.log('onError', result);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        message.info(error);
      });

    this.setState({
      loading2: false
    });
    console.log('fileList2 ', this.state.fileList2);
  };

  customRequest3 = (option) => {
    console.log('option', option);
    this.setState({
      loading3: true
    });
    ajax({
      method: 'GET',
      url: '/api/v1/oss_sts?bucket=matrix-server'
    })
      .then(async (res) => {
        this.setState({
          res: {
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            bucket: 'matrix-server',
            dir: 'upload',
            expire: res.data.expire,
            region: res.data.region,
            stsToken: res.data.stsToken
          }
        });
        console.log('res: ', this.state.res);

        if (this.state.res && res.data) {
          const client = new OSS({
            ...res.data,
            expire: ''
          });

          const fileName = `upload/${shortid.generate()}${getFileExt(option.file.name)}`;
          const result = await client.put(fileName, option.file); // await

          if (result.res && result.res.status === 200) {
            option.onSuccess(result);
            console.log('success', result);
            const signatureUrlIdCardBack = client.signatureUrl(
              result.url.slice(result.url.match('upload').index, result.url.length)
            );
            this.setState({
              fileList3: [
                {
                  baseUrl: result.url,
                  uid: result.name,
                  name: '法人身份证反面',
                  state: 'done',
                  url: signatureUrlIdCardBack
                }
              ]
            });
            console.log('info => ', this.state.fileList3);
          } else {
            option.onError(result);
            console.log('onError', result);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        message.info(error);
      });

    this.setState({
      loading3: false
    });
    console.log('fileList3 ', this.state.fileList3);
  };

  handleCancel1 = () => this.setState({ previewVisible1: false });

  handleCancel2 = () => this.setState({ previewVisible2: false });

  handleCancel3 = () => this.setState({ previewVisible3: false });

  handlePreview1 = (file) => {
    this.setState({
      previewImage1: file.url || file.thumbUrl,
      previewVisible1: true
    });
  };

  handlePreview2 = (file) => {
    console.log(file);
    this.setState({
      previewImage2: file.url || file.thumbUrl,
      previewVisible2: true
    });
  };

  handlePreview3 = (file) => {
    this.setState({
      previewImage3: file.url || file.thumbUrl,
      previewVisible3: true
    });
  };

  handleChange1 = (info) => {
    console.log('info', info);
    if (info.fileList.length === 0) {
      this.setState({ fileList1: info.fileList });
    }
    if (info.file.status === 'uploading') {
      console.log('uploading');
      this.setState({
        fileList1: info.fileList,
        loading1: true
      });
      return;
    }
    console.log(this.state.loading1);
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      console.log('upload done');
      this.setState({
        // imageUrl,
        loading1: false
      });
      // getBase64(info.file.originFileObj, () =>
      //   this.setState({
      //     // imageUrl,
      //     loading1: false
      //   })
      // );
    }
  };

  handleChange2 = (info) => {
    console.log('info', info);
    if (info.fileList.length === 0) {
      this.setState({ fileList2: info.fileList });
    }
    if (info.file.status === 'uploading') {
      console.log('uploading');
      this.setState({
        fileList2: info.fileList,
        loading2: true
      });
      return;
    }
    console.log(this.state.loading2);
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      console.log('upload done');
      this.setState({
        // imageUrl,
        loading2: false
      });
    }
  };

  handleChange3 = (info) => {
    console.log('info', info);
    if (info.fileList.length === 0) {
      this.setState({ fileList3: info.fileList });
    }
    if (info.file.status === 'uploading') {
      console.log('uploading');
      this.setState({
        fileList3: info.fileList,
        loading3: true
      });
      return;
    }
    console.log(this.state.loading3);
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      console.log('upload done');
      this.setState({
        // imageUrl,
        loading3: false
      });
    }
  };

  render() {
    const {
      previewVisible1,
      previewImage1,
      fileList1,
      previewVisible2,
      previewImage2,
      fileList2,
      previewVisible3,
      previewImage3,
      fileList3
    } = this.state;
    const uploadButton1 = (
      <div style={{ width: 400, height: 200 }}>
        <Icon
          type="file-protect"
          style={{ fontSize: 50, color: '#4A90E2', marginTop: 30 }}
          theme="outlined"
        />
        <h3 style={{ marginTop: 30 }} className="ant-upload-text">
          点击或将营业执照拖拽到这里上传
        </h3>
        <p className="ant-upload-hint">支持拓展名（后缀）：.jpg .jpeg 小于500k</p>
      </div>
    );
    const uploadButton2 = (
      <div style={{ width: 400, height: 200 }}>
        <Icon
          type="idcard"
          style={{ fontSize: 50, color: '#4A90E2', marginTop: 30 }}
          theme="outlined"
        />
        <h3 style={{ marginTop: 30 }} className="ant-upload-text">
          点击或将身份证正面拖拽到这里上传
        </h3>
        <p className="ant-upload-hint">支持拓展名（后缀）：.jpg .jpeg 小于500k</p>
      </div>
    );
    const uploadButton3 = (
      <div style={{ width: 400, height: 200 }}>
        <Icon
          type="idcard"
          style={{ fontSize: 50, color: '#4A90E2', marginTop: 30 }}
          theme="outlined"
        />
        <h3 style={{ marginTop: 30 }} className="ant-upload-text">
          点击或将身份证反面拖拽到这里上传
        </h3>
        <p className="ant-upload-hint">支持拓展名（后缀）：.jpg .jpeg 小于500k</p>
      </div>
    );

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <p>提交后不可修改，是否确认提交？</p>
        </Modal>
        <Card bordered={false}>
          <Alert
            message={alertStatusContent[this.state.alertStatusIndex].message}
            description={
              this.state.alertStatusIndex !== 2
                ? alertStatusContent[this.state.alertStatusIndex].description
                : `当前账号，企业信息审核未通过;${this.state.reSubmitInfo}`
            }
            type={alertStatusContent[this.state.alertStatusIndex].type}
            showIcon={alertStatusContent[this.state.alertStatusIndex].showIcon}
            closable
            onClose={onClose}
          />
        </Card>
        <Card bordered={false}>
          <Form onSubmit={this.showOnSubmitModal}>
            <Form.Item label="企业名称" {...formItemLayout}>
              <Card bordered={false} style={{ marginTop: -20 }}>
                {getFieldDecorator('companyName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入企业名称'
                    }
                  ]
                })(<Input disabled={!this.state.companyNameInupt} placeholder="输入企业名称" />)}
              </Card>
            </Form.Item>
            <Form.Item {...formItemLayout} label="营业执照">
              <Card bordered={false} style={{ marginTop: -20 }}>
                <Upload
                  key="1"
                  listType="picture-card"
                  fileList={fileList1}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.customRequest1}
                  onRemove={
                    !(this.state.alertStatusIndex === 1 || this.state.alertStatusIndex === 3)
                  }
                  onPreview={this.handlePreview1}
                  onChange={this.handleChange1}
                  style={{ width: 380, height: 200 }}
                >
                  {fileList1.length >= 1 ? null : uploadButton1}
                </Upload>
                <Modal visible={previewVisible1} footer={null} onCancel={this.handleCancel1}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage1} />
                </Modal>
              </Card>
            </Form.Item>
            <Form.Item {...formItemLayout} label="法人身份证">
              <Card bordered={false}>
                <Upload
                  listType="picture-card"
                  fileList={fileList2}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.customRequest2}
                  onRemove={
                    !(this.state.alertStatusIndex === 1 || this.state.alertStatusIndex === 3)
                  }
                  onPreview={this.handlePreview2}
                  onChange={this.handleChange2}
                >
                  {fileList2.length >= 1 ? null : uploadButton2}
                </Upload>
                <Modal visible={previewVisible2} footer={null} onCancel={this.handleCancel2}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage2} />
                </Modal>
              </Card>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              wrapperCol={{
                sm: { offset: 6 }
              }}
            >
              <Card bordered={false}>
                <Upload
                  listType="picture-card"
                  fileList={fileList3}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.customRequest3}
                  onRemove={
                    !(this.state.alertStatusIndex === 1 || this.state.alertStatusIndex === 3)
                  }
                  onPreview={this.handlePreview3}
                  onChange={this.handleChange3}
                >
                  {fileList3.length >= 1 ? null : uploadButton3}
                </Upload>
                <Modal visible={previewVisible3} footer={null} onCancel={this.handleCancel3}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage3} />
                </Modal>
              </Card>
            </Form.Item>
            {this.state.alertStatusIndex === 0 || this.state.alertStatusIndex === 2 ? (
              <Form.Item {...formItemLayout} label="提交后不可修改">
                <Card bordered={false} style={{ marginTop: 50 }}>
                  <Button
                    disabled={this.state.loading1 || this.state.loading2 || this.state.loading3}
                    type="primary"
                    style={{ width: 420 }}
                    htmlType="submit"
                  >
                    确认提交
                  </Button>
                </Card>
              </Form.Item>
            ) : null}
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(CorporateInformation);
