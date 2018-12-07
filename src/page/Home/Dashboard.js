import React from 'react';
import { Col, Row } from 'antd';
import SummaryCard from './SummaryCard';

const Dashboard = ({ loading, todayDeposit, todayWithdraw, balance, campaigns }) => (
  <Row gutter={16} type="flex" justify="space-around">
    <Col span={6} value={10}>
      <SummaryCard
        title="今日存入"
        intro="今日存入点击量
"
        loading={loading}
        total={todayDeposit}
      />
    </Col>
    <Col span={6} value={10}>
      <SummaryCard
        title="今日取用"
        intro="今日取用点击量"
        loading={loading}
        total={todayWithdraw}
      />
    </Col>
    <Col span={6} value={10}>
      <SummaryCard
        title="存量余额"
        intro="当前剩余可用点击量"
        loading={loading}
        total={balance}
      />
    </Col>
    <Col span={6} value={10}>
      <SummaryCard
        title="当前存量计划"
        intro="目前正在投放的推广计划"
        loading={loading}
        total={`${campaigns || 0}个`}
      />
    </Col>
  </Row>
);

export default Dashboard;
