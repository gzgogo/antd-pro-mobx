import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import cssModules from 'react-css-modules';
import { PageHeader } from 'ant-design-pro';
import { Card } from 'antd';
import LineChart from './LineChart';
import DataTable from './DataTable';

import styles from './style.less';

const breadcrumbList = [{
  title: '推广管理'
}, {
  title: '推广计划',
  href: '/'
}, {
  title: '数据报表'
}];

@inject('dashboardStore')
@observer
@cssModules(styles)
class DataReport extends Component {
  async componentWillMount() {
    const { match, dashboardStore } = this.props;
    const { id } = match.params || {};
    await dashboardStore.onWillMount(id);
  }

  render() {
    const {
      loading,
      name,
      data,
      withdrawDashboardData,
      withdrawChartOptions,
      getWithdraw
    } = this.props.dashboardStore;

    return (
      <div>
        <PageHeader title={name} breadcrumbList={breadcrumbList} />
        <Card style={{ backgroundColor: '#f0f2f5' }} bordered={false}>
          <LineChart
            loading={loading}
            dashboardData={withdrawDashboardData}
            chartOptions={withdrawChartOptions}
            onRangeChange={getWithdraw}
          />
          <DataTable
            loading={loading}
            data={data}
          />
        </Card>
      </div>
    );
  }
}

export default DataReport;
