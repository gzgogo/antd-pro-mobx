import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import cssModules from 'react-css-modules';
import { Button } from 'antd';
import { PageHeader } from 'ant-design-pro';
import FilterForm from './FilterForm';
import DataTable from './DataTable';

import styles from './style.less';

@inject('exchagneListStore')
@observer
@cssModules(styles)
class ExchangePlanList extends Component {
  constructor(props) {
    super(props);

    this.store = this.props.exchagneListStore;
  }

  async componentWillMount() {
    const { location, match, history } = this.props;

    await this.store.onWillMount(location, match, history);
  }

  render() {
    const { create, search, terminate, data } = this.store;
    return (
      <div>
        <PageHeader title="推广计划" content="" breadcrumbList={[{ title: '推广管理' }]} />
        <div className="content-card">
          <FilterForm onSubmit={search} />
          <Button type="primary" styleName="btn-create" onClick={create}>新建</Button>
          <DataTable data={data} onTerminate={terminate} />
        </div>
      </div>
    );
  }
}

export default ExchangePlanList;
