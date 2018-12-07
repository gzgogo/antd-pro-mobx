import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import { Input, Form, Select, Radio, InputNumber, Icon, Spin, Modal } from 'antd';
import OSSUpload from 'component/OSSUpload';

import styles from './style.less';

const { Option } = Select;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@cssModules(styles)
class ExchangeForm extends Component {
  static defaultProps = {
    enabledFields: [],
    labels: {
      name: '留存名称'
    }
  }

  static displayName = 'ExchangeForm';

  beforeUpload = (file) => {
    const image = file.type.indexOf('image') > -1;
    if (!image) {
      Modal.error({
        content: '只能上传图片文件'
      });
      return false;
    }

    const empty = file.size <= 0;
    if (empty) {
      Modal.error({
        content: '不能上传空文件'
      });
      return false;
    }

    const limit = file.size / 1024 / 1024 < 10;
    if (!limit) {
      Modal.error({
        content: '文件大小不能超过10M'
      });
      return false;
    }

    return true;
  }

  checkInputLength(field, maxLength, rule, value, callback) {
    if (value && value.toString().length > maxLength) {
      callback(`不能超过${maxLength}个字符`);

      // 不能在这里setFieldsValue，否则错误提示会被清空
      // let obj = {};
      // obj[field] = value.substr(0, maxLength);
      // this.props.form.setFieldsValue(obj);
    } else {
      callback();
    }
  }

  renderName(formItemLayout, disabled) {
    const { enabledFields, mode, name } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        label="推广计划名称"
        // colon={false}
        {...formItemLayout}
      >
        {
          mode === 'view'
            ? <span>{name.value}</span>
            : (
              getFieldDecorator('name', {
                initialValue: '',
                validateTrigger: ['onChange'],
                rules: [
                  { required: true, message: '请输入名称' },
                  { pattern: '^[a-zA-Z0-9_\\u4e00-\\u9fa5_\\\\-]+$', message: '仅支持中英文、数字和下划线' },
                  { validator: (rule, value, callback) => this.checkInputLength('name', 40, rule, value, callback) }
                ]
              })(
                <Input
                  className="field long"
                  disabled={enabledFields.indexOf('name') < 0 && disabled}
                  placeholder="请输入"
                />
              )
            )
        }
      </FormItem>
    );
  }

  renderSlogan(formItemLayout, disabled) {
    const { enabledFields, mode, slogan } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        label="一句话描述"
        // colon={false}
        {...formItemLayout}
      >
        {
          mode === 'view'
            ? <span>{slogan.value}</span>
            : (
              getFieldDecorator('slogan', {
                initialValue: '',
                validateTrigger: ['onChange'],
                rules: [
                  { required: true, message: '请输入描述' },
                  { pattern: '^[a-zA-Z0-9_\\u4e00-\\u9fa5_\\\\-]+$', message: '仅支持中英文、数字和下划线' },
                  { validator: (rule, value, callback) => this.checkInputLength('name', 40, rule, value, callback) }
                ]
              })(
                <Input
                  className="field long"
                  disabled={enabledFields.indexOf('slogan') < 0 && disabled}
                  placeholder="请输入"
                />
              )
            )
        }
      </FormItem>
    );
  }

  renderExchangeType(formItemLayout, disabled) {
    const { form, mode, dataExchangeType } = this.props;
    const { getFieldDecorator } = form;

    return (
      <FormItem
        className=""
        label="推广类型"
        // colon={false}
        {...formItemLayout}
      >
        {
          mode === 'view'
            ? (
              <span>{dataExchangeType.value === 0 ? '存量' : '取量'}</span>
            )
            : (
              getFieldDecorator('dataExchangeType', {
                initialValue: ''
              })(
                <RadioGroup disabled={disabled}>
                  <Radio value={0}>存量</Radio>
                  <Radio value={1}>取量</Radio>
                </RadioGroup>
              )
            )
        }
      </FormItem>
    );
  }

  renderMPSelect(formItemLayout, disabled) {
    const { mps, mode, mediaId } = this.props;
    const { getFieldDecorator } = this.props.form;

    const mpOptions = mps.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>);

    return (
      <FormItem
        {...formItemLayout}
        label="选择小程序"
      >
        {
          mode === 'view'
            ? (
              <span>{mediaId.value}</span>
            )
            : (
              getFieldDecorator('mediaId', {
                rules: [
                  { required: true, message: '请选择小程序' }
                ]
              })(
                <Select
                  className="field"
                  placeholder="请选择小程序"
                  showSearch
                  disabled={disabled}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {mpOptions}
                </Select>
              )
            )
        }
      </FormItem>
    );
  }

  renderADSelect(formItemLayout, disabled) {
    const { ads, adLoading, mode, adRefld } = this.props;
    const { getFieldDecorator } = this.props.form;

    const adMap = {};
    const adOptions = ads.map((item) => {
      adMap[item.adId] = item.adName;
      return <Option key={item.adId} value={item.adId}>{item.adName}</Option>;
    });

    return (
      <FormItem
        {...formItemLayout}
        label="选择广告位"
      >
        {
          mode === 'view'
            ? <span>{adMap[adRefld.value]}</span>
            : (
              getFieldDecorator('adRefld', {
                rules: [
                  { required: true, message: '广告位不能为空' }
                ]
              })(
                <Spin spinning={adLoading}>
                  <Select
                    className="field"
                    placeholder="请选择广告位"
                    showSearch
                    disabled={disabled}
                    filterOption={(input, option) => (
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    )}
                  >
                    {adOptions}
                  </Select>
                </Spin>
              )
            )
        }
      </FormItem>
    );
  }

  renderEstimeateData(formItemLayout, disabled) {
    const { mode, estimeateData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        {...formItemLayout}
        label="预计日均PV"
      >
        {
          mode === 'view'
            ? <span>{estimeateData}</span>
            : (
              getFieldDecorator('estimeateData', {
                rules: [
                  { required: true, message: '预计日均PV不能为空' }
                ]
              })(
                <InputNumber style={{ width: 160 }} min={0} disabled={disabled} />
              )
            )
        }
      </FormItem>
    );
  }

  renderADType(formItemLayout, disabled) {
    const { form, mode, adType } = this.props;
    const { getFieldDecorator } = form;

    return (
      <FormItem
        style={{ marginBottom: 10 }}
        label="广告位类型"
        // colon={false}
        {...formItemLayout}
      >
        {
          mode === 'view'
            ? <span>{adType.value === 1 ? 'Banner' : '悬窗'}</span>
            : (
              getFieldDecorator('adType', {
                initialValue: ''
              })(
                <RadioGroup disabled={disabled}>
                  <Radio value={1}>Banner</Radio>
                  <Radio value={2}>悬窗</Radio>
                </RadioGroup>
              )
            )
        }
      </FormItem>
    );
  }

  renderLogoUpload(formItemLayout, disabled) {
    const { mode } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        {...formItemLayout}
        label="小程序logo"
        extra=""
      >
        {
          getFieldDecorator('logo', {
            rules: [
              { required: true, message: '图片未上传' }
            ]
          })(
            <OSSUpload
              listType="picture-card"
              desc={mode === 'view' ? '' : 'png格式 200*200'}
              disabled={disabled}
              beforeUpload={this.beforeUpload}
            >
              {
                mode === 'view'
                  ? null
                  : (
                    <div>
                      <Icon type="plus" style={{ fontSize: 24 }} />
                      <div className="ant-upload-text">上传图片</div>
                    </div>
                  )
              }
            </OSSUpload>
          )}
      </FormItem>
    );
  }

  renderMPCodeUpload(formItemLayout, disabled) {
    const { mode } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        {...formItemLayout}
        label="小程序码"
        extra=""
      >
        {
          getFieldDecorator('mpCode', {
            rules: [
              { required: true, message: '图片未上传' }
            ]
          })(
            <OSSUpload
              listType="picture-card"
              desc={mode === 'view' ? '' : 'png格式 200*200'}
              disabled={disabled}
              beforeUpload={this.beforeUpload}
            >
              {
                mode === 'view'
                  ? null
                  : (
                    <div>
                      <Icon type="plus" style={{ fontSize: 24 }} />
                      <div className="ant-upload-text">上传图片</div>
                    </div>
                  )
              }
            </OSSUpload>
          )}
      </FormItem>
    );
  }

  renderPagePath(formItemLayout, disabled) {
    const { enabledFields } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        label="页面路径"
        // colon={false}
        {...formItemLayout}
      >
        {
          getFieldDecorator('pagePath', {
            initialValue: '',
            validateTrigger: ['onChange'],
            rules: [
              // { required: true, message: '页面路径不能为空' },
              { pattern: '^[a-zA-Z0-9_\\u4e00-\\u9fa5_\\\\-]+$', message: '仅支持中英文、数字和下划线' },
              { validator: (rule, value, callback) => this.checkInputLength('name', 40, rule, value, callback) }
            ]
          })(
            <Input
              className="field long"
              disabled={enabledFields.indexOf('pathPath') < 0 && disabled}
              placeholder="请输入页面路径"
            />
          )
        }
      </FormItem>
    );
  }

  renderUV(formItemLayout, disabled) {
    const { enabledFields } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <FormItem
        label="落地UV数"
        // colon={false}
        {...formItemLayout}
      >
        {
          getFieldDecorator('uv', {
            initialValue: '',
            validateTrigger: ['onChange'],
            rules: [
              // { required: true, message: '落地UV数不能为空' },
              { pattern: '^[a-zA-Z0-9_\\u4e00-\\u9fa5_\\\\-]+$', message: '仅支持中英文、数字和下划线' },
              { validator: (rule, value, callback) => this.checkInputLength('name', 40, rule, value, callback) }
            ]
          })(
            <InputNumber
              className="field long"
              disabled={enabledFields.indexOf('uv') < 0 && disabled}
              placeholder="请输入落地UV数"
            />
          )
        }
      </FormItem>
    );
  }

  render() {
    const { disabled } = this.props;
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
    // const formItemLayout = {};
    // const executeType = form.getFieldValue('dataExchangeTypeQUERY');

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          { this.renderName(formItemLayout, disabled) }
          {/* { this.renderExchangeType(formItemLayout, disabled) } */}
          { this.renderMPSelect(formItemLayout, disabled) }
          {/* { dataExchangeType.value === 0 && this.renderADSelect(formItemLayout, disabled) } */}
          {/* { dataExchangeType.value === 0 && this.renderEstimeateData(formItemLayout, disabled) } */}
          {/* { dataExchangeType.value === 1 && this.renderADType(formItemLayout, disabled) } */}
          { this.renderLogoUpload(formItemLayout, disabled) }
          { this.renderMPCodeUpload(formItemLayout, disabled) }
          { this.renderSlogan(formItemLayout, disabled) }
          {/* { dataExchangeType.value === 1 && this.renderPagePath(formItemLayout, disabled) }
          { dataExchangeType.value === 1 && this.renderUV(formItemLayout, disabled) } */}
        </Form>
      </div>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        ...props.name,
        value: props.name.value
      }),
      // remark: Form.createFormField({
      //   ...props.remark,
      //   value: props.remark.value
      // }),
      // dataExchangeType: Form.createFormField({
      //   ...props.dataExchangeType,
      //   value: props.dataExchangeType.value
      // }),
      // groupFilter: Form.createFormField({
      //   ...props.groupFilter,
      //   value: props.groupFilter.value
      // }),
      mediaId: Form.createFormField({
        ...props.mediaId,
        value: props.mediaId.value
      }),
      // adRefld: Form.createFormField({
      //   ...props.adRefld,
      //   value: props.adRefld.value
      // }),
      // estimeateData: Form.createFormField({
      //   ...props.estimeateData,
      //   value: props.estimeateData.value
      // }),
      // adType: Form.createFormField({
      //   ...props.adType,
      //   value: props.adType.value
      // }),
      logo: Form.createFormField({
        ...props.logo,
        value: props.logo.value
      }),
      mpCode: Form.createFormField({
        ...props.mpCode,
        value: props.mpCode.value
      }),
      slogan: Form.createFormField({
        ...props.slogan,
        value: props.slogan.value
      })
    };
  }
})(ExchangeForm);
