import React, { Component } from 'react';
// import { PropTypes } from 'prop-types';
import { inject, observer } from 'mobx-react';
import cssModules from 'react-css-modules';
import moment from 'moment';
import { Card } from 'antd';
import Dashboard from './Dashboard';
import LineChart from './LineChart';
import styles from './style.less';

@inject('homeStore')
@observer
@cssModules(styles)
class Home extends Component {
  async componentWillMount() {
    const { onWillMount } = this.props.homeStore;
    await onWillMount();
  }

  onChange = () => {

  }

  getRagnes = () => {
    // const endDate = moment().subtract(1, 'days'); // 昨天
    const endDate = moment();

    return {
      今日: [moment(), endDate],
      本周: [moment().startOf('week'), endDate],
      本月: [moment().startOf('month'), endDate],
      本年: [moment().startOf('year'), endDate]
    };
  }

  render() {
    const {
      loading,
      todayDeposit,
      todayWithdraw,
      balance,
      campaigns,
      withdrawDashboardData,
      withdrawChartOptions,
      depositDashboardData,
      depositChartOptions,
      getWithdraw,
      getDeposit
    } = this.props.homeStore;

    return (
      <div style={{ backgroundColor: '#f0f2f5' }}>
        <Card style={{ backgroundColor: '#f0f2f5' }} bordered={false}>
          <Dashboard
            loading={loading}
            todayDeposit={todayDeposit}
            todayWithdraw={todayWithdraw}
            balance={balance}
            campaigns={campaigns}
          />
          <LineChart
            loading={loading}
            ranges={this.getRagnes()}
            dashboardData={withdrawDashboardData}
            chartOptions={withdrawChartOptions}
            onRangeChange={getWithdraw}
          />
          <LineChart
            loading={loading}
            ranges={this.getRagnes()}
            dashboardData={depositDashboardData}
            chartOptions={depositChartOptions}
            onRangeChange={getDeposit}
          />
        </Card>
      </div>
    );
  }
}

export default Home;
