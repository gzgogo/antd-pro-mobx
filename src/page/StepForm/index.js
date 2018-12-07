import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import cssModules from 'react-css-modules';
import { Card, Steps, Button, Divider, Spin } from 'antd';
import Form from './Form';
import styles from './style.less';

const { Step } = Steps;

@inject('stepFormStore')
@observer
@cssModules(styles)
class StepForm extends Component {
  state = {
    // value: 1
  }

  constructor(props) {
    super(props);

    this.store = this.props.exchagneCreateStore;
  }


  async componentWillMount() {
    const { location, match, history } = this.props;

    await this.store.onWillMount(location, match, history);
  }

  handleNext = () => {
    const { next } = this.store;
    const { form } = this.exchangeForm.props;

    form.validateFields((err, values) => {
      if (!err) {
        next(values);
      }
    });
  }

  render() {
    // const { exchagneCreateStore: store } = this.props;
    const { loading, adLoading, step, fields, mps, ads, onFormChange, prev, submit } = this.store;

    return (
      <div>
        <Spin spinning={loading}>
          <Card>
            <Steps current={step}>
              <Step title="填写计划信息" description="" />
              <Step title="确认" description="" />
            </Steps>
            <Card bordered={false}>
              <Form
                wrappedComponentRef={f => (this.exchangeForm = f)}
                adLoading={adLoading}
                mode={step === 0 ? 'edit' : 'view'}
                {...fields}
                mps={mps}
                ads={ads}
                onChange={onFormChange}
              />
              <div styleName="actions">
                {
                  step === 0
                    ? (
                      <Button styleName="btn-next" type="primary" onClick={this.handleNext}>下一步</Button>
                    )
                    : (
                      <React.Fragment>
                        <Button type="default" onClick={prev}>返回</Button>
                        <Button styleName="btn-next" type="primary" onClick={submit}>提交</Button>
                      </React.Fragment>
                    )
                }
              </div>
              <Divider />
              <Card bordered={false}>
                <p>说明</p>
                <p>落地UV</p>
                <p>指广告主处的UV数，由撮和 SDK 统计</p>
                <p>积分获取及消耗</p>
                <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。这里可以放一些关于产品的常见问题说明。</p>
              </Card>
            </Card>
          </Card>
        </Spin>
      </div>
    );
  }
}

export default StepForm;
