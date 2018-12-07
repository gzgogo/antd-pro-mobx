import React, { Component } from 'react';
import OSS from 'ali-oss';
import shortid from 'shortid';
import { Link } from 'react-router-dom';
import { Form, Card, Button, Select, Radio, message, Input, Divider, Upload, Icon } from 'antd';
import ajax from 'util/api/ajax';

function getFileExt(filename) {
  let ext = '';
  const pos = filename.lastIndexOf('.');
  if (pos > 0) {
    ext = filename.substring(pos, filename.length);
  }

  return ext;
}

class CreateADPosition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChooseCustomize: false,
      mpList: [],
      adPicArr: [],
      imageUrl: '',
      res: {},
      uploadToggle: true
    };
    this.initial();
  }

  initial = () => {
    console.log('initial');
    ajax({
      method: 'GET',
      url: '/api/v1/mp/all'
    })
      .then((res) => {
        console.log(res);
        this.setState({
          mpList: res.data
        });
        console.log('res: ', this.state.mpList);
      })
      .catch((error) => {
        console.log(error);
      });
    const type = 1;
    const arr = [];
    const upperCaseNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    ajax({
      url: `/api/v1/ad/${type}/images`,
      method: 'GET'
    })
      .then((res) => {
        console.log('res ', res);
        if (res.code === 0) {
          for (let i = 0; i < res.data.length; i++) {
            const index = `默认广告图${upperCaseNumber[i]}`;
            arr.push({
              [index]: res.data[i]
            });
          }
          const str = '自行上传';
          arr.push({
            [str]: ''
          });
          console.log('check this arr: ', arr);
          this.setState({
            adPicArr: arr,
            imageUrl: res.data[0]
          });
          console.log('log the obj of arr: ', Object.keys(arr));
          arr.map(obj => console.log('index: ', Object.keys(obj)[0]));
          console.log(this.state.adPicArr);
        }
      })
      .catch((error) => {
        console.log('error ', error);
      });
    // console.log('this.selectString: ', this.state.adPicArr, this.state.adPicArr[0]['默认广告图一']);
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log('imageUrl: ', this.state.imageUrl);
        let type;
        if (values.ADType === 'banner') {
          type = 1;
        } else if (values.ADType === 'xuanChuang') {
          type = 2;
        }
        const { mpList, imageUrl } = this.state;
        console.log('mpList: ', mpList, imageUrl);
        ajax({
          method: 'POST',
          url: '/api/v1/ad/0',
          data: {
            adName: values.name,
            appId: values.chooseOne,
            type,
            imageUrl
          }
        })
          .then((res) => {
            console.log('res: ', res);
            if (res.code === 10605002) {
              message.info('该广告位已存在');
            }
            if (res.code === 0) {
              message.success('广告位创建成功！');
              this.initial();
              this.props.history.push({ pathname: '/project/mediamgr/adlist' });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    console.log('file: ', file);
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  };

  radioChange = (e) => {
    console.log('radioChange: ', e);
    if (e.target.value === 'customize') {
      this.setState({
        onChooseCustomize: true
      });
    } else {
      const { resetFields } = this.props.form;
      const arr = [];
      const upperCaseNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
      this.setState({
        onChooseCustomize: false,
        uploadToggle: true
      });
      if (e.target.value === 'banner') {
        const type = 1;
        ajax({
          url: `/api/v1/ad/${type}/images`,
          method: 'GET'
        })
          .then((res) => {
            console.log('res ', res);
            if (res.code === 0) {
              for (let i = 0; i < res.data.length; i++) {
                const index = `默认广告图${upperCaseNumber[i]}`;
                arr.push({
                  [index]: res.data[i]
                });
              }
              const str = '自行上传';
              arr.push({
                [str]: ''
              });
              console.log('check this arr: ', arr);
              this.setState({
                adPicArr: arr,
                imageUrl: res.data[0]
              });
              resetFields('SelectOption');
              console.log('log the obj of arr: ', Object.keys(arr));
              arr.map(obj => console.log('index: ', Object.keys(obj)[0]));
              console.log(this.state.adPicArr);
            }
          })
          .catch((error) => {
            console.log('error ', error);
          });
      } else if (e.target.value === 'xuanChuang') {
        const type = 2;
        ajax({
          url: `/api/v1/ad/${type}/images`,
          method: 'GET'
        })
          .then((res) => {
            console.log('res ', res);
            if (res.code === 0) {
              for (let i = 0; i < res.data.length; i++) {
                const index = `默认广告图${upperCaseNumber[i]}`;
                arr.push({
                  [index]: res.data[i]
                });
              }
              const str = '自行上传';
              arr.push({
                [str]: ''
              });
              console.log('check this arr: ', arr);
              this.setState({
                adPicArr: arr,
                imageUrl: res.data[0]
              });
              resetFields('SelectOption');
              console.log('log the obj of arr: ', Object.keys(arr));
              arr.map(obj => console.log('index: ', Object.keys(obj)[0]));
              console.log(this.state.adPicArr);
            }
          })
          .catch((error) => {
            console.log('error ', error);
          });
      }
    }
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };

  selectChange = (value) => {
    console.log('selectChange: ', value);
    const arr = this.state.adPicArr;
    let uploadToggle;
    if (value === '自行上传') {
      uploadToggle = false;
    } else {
      uploadToggle = true;
    }
    arr.map(
      obj =>
        (Object.keys(obj)[0] === value
          ? this.setState({
            imageUrl: obj[value],
            uploadToggle
          })
          : null)
    );
    console.log('log imageUrl: ', this.state.imageUrl);
  };

  beforeUpload = () => {
    const { fileList } = this.state;
    console.log('beforeUpload ', fileList);
  };

  handlePreview = (file) => {
    console.log('file: ', file);
  };

  customRequest = (option) => {
    console.log('option', option);
    this.setState({
      loading: true
    });
    ajax({
      url: '/api/v1/oss_sts?bucket=matrix-static',
      method: 'GET'
    })
      .then(async (res) => {
        console.log('res', res);
        this.setState({
          res: {
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            bucket: 'matrix-static',
            expire: res.data.expire,
            region: res.data.region,
            stsToken: res.data.stsToken
          }
        });
        console.log('res: ', this.state.res, res.data);

        if (this.state.res && res.data) {
          const client = new OSS({
            ...res.data,
            expire: ''
          });
          console.log('client: ', client);

          console.log(
            'option: ', option,
            'option.file.name: ', option.file.name,
            'getFileExt: ', getFileExt(option.file.name),
            'shortid: ', shortid.generate()
          );
          const fileName = `${shortid.generate()}${getFileExt(option.file.name)}`;
          console.log('fileName: ', fileName);
          const result = await client.put(fileName, option.file); // await
          console.log('result: ', result);

          if (result.res && result.res.status === 200) {
            // option.onSuccess(result);
            // console.log('success', result);
            // const selfPicUrl = client.signatureUrl(
            //   result.url.slice(result.url.lastIndexOf('/').index, result.url.length)
            // );
            // console.log('selfPicUrl: ', selfPicUrl);
            // const selfPicUrl = client.signatureUrl(
            //   result.url.slice(result.url.match('upload').index, result.url.length)
            // );
            this.setState({
              // imageUrl: selfPicUrl,
              imageUrl: result.url,
              fileList: [
                {
                  baseUrl: result.url,
                  uid: result.name,
                  name: 'selfPic',
                  state: 'done',
                  url: result.url
                }
              ]
            });
            console.log('info => ', this.state.fileList);
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
      loading: false
    });
    console.log('fileList ', this.state.fileList);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { mpList, adPicArr, imageUrl, onChooseCustomize, uploadToggle } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 10
      }
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    console.log('log url: ');

    return (
      <div>
        <Card bordered={false}>
          <Form onSubmit={this.onSubmit} style={{ maxWidth: 'initial' }}>
            <Form.Item label="广告位名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入广告位名称!'
                  }
                ]
              })(<Input placeholder="填写小程序名称" />)}
            </Form.Item>
            <Form.Item label="选择小程序" {...formItemLayout}>
              {getFieldDecorator('chooseOne', {
                rules: [
                  {
                    required: true,
                    message: '请选择条目'
                  }
                ]
              })(
                <Select placeholder="请选择">
                  {mpList.map(obj => (
                    <Select.Option key={obj.id}>
                      {obj.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="广告位类型">
              {getFieldDecorator('ADType', {
                rules: [
                  {
                    required: true,
                    message: '请选择广告类型'
                  }
                ],
                initialValue: 'banner'
              })(
                <Radio.Group onChange={this.radioChange}>
                  <Radio value="banner">Banner</Radio>
                  <Radio value="xuanChuang">悬窗</Radio>
                  <Radio value="customize">自定义</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {!onChooseCustomize ? (
              <Form.Item {...formItemLayout} label="广告位图片">
                {
                  (console.log('adPicArr ', adPicArr),
                  adPicArr.map(obj =>
                    console.log('adPicArr index: ', Object.keys(obj)[0], obj[Object.keys(obj)[0]])
                  ))
                }
                {getFieldDecorator('SelectOption', {
                  initialValue: '默认广告图一'
                })(
                  <Select onChange={this.selectChange}>
                    {adPicArr.length > 0
                      ? adPicArr.map(obj => (
                        <Select.Option key={Object.keys(obj)[0]}>
                          {Object.keys(obj)[0]}
                        </Select.Option>
                      ))
                      : null}
                  </Select>
                )}
                {adPicArr.length > 0 ? (
                  <div style={{ marginTop: 20, width: 90 }}>
                    <Upload
                      fileist={adPicArr}
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      disabled={uploadToggle}
                      beforeUpload={this.beforeUpload}
                      previewImage={this.previewImage}
                      customRequest={this.customRequest}
                    >
                      {imageUrl.length > 1 ? (
                        <img style={{ width: 370, height: 'auto' }} src={imageUrl} alt="avatar" />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </div>
                ) : null}
              </Form.Item>
            ) : null}

            <Divider />
            <Card bordered={false} style={{ opacity: 0.7 }}>
              <h2>说明</h2>
              <h3>下载SDK</h3>
              <span>
                <a>点击此处</a> 下载SDK，按照指引在代码中嵌入广告位。
              </span>
              <h3 style={{ marginTop: 10 }}>广告位类型</h3>
              <span>支持横幅及悬窗形式广告位，以及自定义广告位，点击后将进入推广网络页面。</span>
              <h3 style={{ marginTop: 10 }}>广告位图片</h3>
              <span>
                撮和提供默认广告位图片供使用，开发者亦可按照尺寸要求，上传自行设计的图片。
              </span>
            </Card>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 4 }
              }}
              style={{ marginTop: 20 }}
            >
              <Link to="/project/mediamgr/adList" >
                <Button>
                  取消
                </Button>
              </Link>
              <Button type="primary" style={{ marginLeft: 50 }} onClick={this.onSubmit}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(CreateADPosition);
