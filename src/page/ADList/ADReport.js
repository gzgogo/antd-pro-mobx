import React, { Component } from 'react';
import { Form, Card, DatePicker, Col, Row, Icon, Table, Tooltip } from 'antd';
import moment from 'moment';
import LineChart from './LineChart';
import { getReportDeposit } from 'util/api';

const { RangePicker } = DatePicker;

const toDay = new Date();

class ADReport extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {
      depositDashboardData: '',
      depositChartOptions: '',
      loading: true,
      dataSource: []
    };
    this.initial();
  }

  getReportDeposit = async () => {
    console.log('onRangePickerChange');
    const { adId } = this.props.location.state;
    const res = await getReportDeposit('', '', '', '', adId);
    console.log('res: ', res);
    if (res.code === 0 && res.data) {
      const { impression, click, data, details } = res.data;
      this.setState({
        depositDashboardData: {
          impression,
          click,
          data
        },
        dataSource: details
      });
      this.setState({
        depositChartOptions: this.transform2Chart('存量数据', details),
        loading: false
      });
      console.log('depositChartOptions: ', this.state.depositChartOptions);
    }
  };

  initial = async () => {
    console.log('initial: ');
    await this.getReportDeposit();
  };

  transform2Chart = (title, data) => {
    if (!Array.isArray(data)) {
      data = [];
    }

    const categories = [];

    const series = [
      {
        name: '曝光',
        data: []
      },
      {
        name: '点击',
        data: []
      }
    ];

    data.forEach((item) => {
      categories.push(item.time);
      series[0].data.push(parseInt(item.impression, 0));
      series[1].data.push(parseInt(item.click, 0));
    });

    const chartOptions = {
      title: {
        text: title
      },
      xAxis: {
        categories
      },
      yAxis: {
        title: '',
        gridLineDashStyle: 'Dot'
      },
      credits: false,
      series
    };

    return chartOptions;
  };

  onRangePickerChange = async (value, dateString) => {
    console.log('onRangePickerChange: ', value, dateString);
    const { adId } = this.props.location.state;
    // console.log('adId: ', adId, this.props.location);
    const res = await getReportDeposit(dateString[0], dateString[1], '', '', adId);
    console.log('res: ', res);
    if (res.code === 0 && res.data) {
      const { impression, click, data, details } = res.data;
      this.setState({
        depositDashboardData: {
          impression,
          click,
          data
        },
        dataSource: details
      });
      this.setState({
        depositChartOptions: this.transform2Chart('存量数据', details)
      });
      console.log('depositChartOptions: ', this.state.depositChartOptions);
    }
  };

  getRagnes = () => {
    console.log('getRagnes');
    const endDate = moment();

    return {
      今日: [moment(), endDate],
      本周: [moment().startOf('week'), endDate],
      本月: [moment().startOf('month'), endDate],
      本年: [moment().startOf('year'), endDate]
    };
  };

  render() {
    const dateFormat = 'YYYY-MM-DD';
    const { getFieldDecorator } = this.props.form;

    const { loading, depositDashboardData, depositChartOptions } = this.state;

    const columns = [
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time'
      },
      {
        title: '曝光量',
        dataIndex: 'impression',
        key: 'impression'
      },
      {
        title: '点击量',
        dataIndex: 'click',
        key: 'click'
      },
      {
        title: '存量',
        dataIndex: 'data',
        key: 'data'
      }
    ];
    console.log('details: ', this.state.dataSource);

    return (
      <Card>
        <Row>
          <Col span={18}>
            <h3>存量数据</h3>
          </Col>
          <Col span={6}>
            {getFieldDecorator('rangePicker', {
              initialValue: [
                moment(toDay.toLocaleDateString(), dateFormat),
                moment(toDay.toLocaleDateString(), dateFormat)
              ]
            })(
              <RangePicker
                onChange={this.onRangePickerChange}
                format={dateFormat}
                allowClear={false}
              />
            )}
          </Col>
        </Row>
        <Card bordered={false}>
          <Col span={8}>
            <p>
              曝光
              <Tooltip placement="topLeft" title="指广告被受众看到的次数">
                <Icon type="info-circle" theme="outlined" />
              </Tooltip>
            </p>
            <h3>{depositDashboardData.impression}</h3>
          </Col>
          <Col span={8}>
            <p>
              点击
              <Tooltip placement="topLeft" title="指广告被受众点击的次数">
                <Icon type="info-circle" theme="outlined" />
              </Tooltip>
            </p>
            <h3>{depositDashboardData.click}</h3>
          </Col>
          <Col span={8}>
            <p>
              总存量
              <Tooltip placement="topLeft" title="通过换量平台网络存入的点击量">
                <Icon type="info-circle" theme="outlined" />
              </Tooltip>
            </p>
            <h3>{depositDashboardData.data}</h3>
          </Col>
        </Card>
        <Card bordered={false}>
          <LineChart
            loading={loading}
            ranges={this.getRagnes()}
            dashboardData={depositDashboardData}
            chartOptions={depositChartOptions}
          />
        </Card>
        <Card bordered={false}>
          <Table
            columns={columns}
            dataSource={this.state.dataSource}
            rowKey="time"
          />
        </Card>
        {/*
          <Card bordered={false}>
            <Button
              onClick={() => {
                const d = new Date();
                console.log('date: ', d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
                console.log('this.props: ', this.props);
                console.log('this.props.parmas: ', this.props.location.state);
                this.initial();
              }}
            >
              click
            </Button>
          </Card>
          */}
      </Card>
    );
  }
}

export default Form.create()(ADReport);
