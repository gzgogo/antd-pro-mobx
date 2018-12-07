import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import { NumberInfo } from 'ant-design-pro';
import { Row, Col, Card } from 'antd';

class LineChart extends Component {
  renderDashboard = () => (
    <Row>
      <Col span={8}>
        <NumberInfo
          subTitle="曝光"
        />
      </Col>
      <Col span={8}>
        <NumberInfo
          subTitle="点击"
        />
      </Col>
      <Col span={8}>
        <NumberInfo
          subTitle=""
        />
      </Col>
    </Row>
  )

  render() {
    const { loading, chartOptions } = this.props;

    return (
      <Card
        bordered={false}
        loading={loading}
      >
        {
          // this.renderDashboard()
        }
        <div>
          <ReactHighcharts
            config={chartOptions}
          />
        </div>
      </Card>
    );
  }
}

export default LineChart;
