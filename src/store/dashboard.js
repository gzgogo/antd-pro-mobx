import { extendObservable, action } from 'mobx';
import { getWithdraw, getCampaignDetail } from 'util/api';

export default class ListStore {
  constructor() {
    this.reset(true);

    this.campaignId = undefined;
  }

  @action
  reset = (init) => {
    const state = {
      name: '',
      data: [],
      withdrawDashboardData: {},
      depositDashboardData: {},
      withdrawChartOptions: this.transform2Chart('取量数据', { xAxis: [], series: [] }),
      depositChartOptions: this.transform2Chart('存量数据', { xAxis: [], series: [] }),
      loading: true
    };

    if (init) {
      extendObservable(this, state);
    } else {
      Object.keys(state).forEach(key => (this[key] = state[key]));
    }
  }

  @action
  onWillMount = async (id) => {
    this.reset();

    this.campaignId = id;

    this.loading = true;
    await this.getDetail();
    await this.getWithdraw();
    this.loading = false;
  }

  getDetail = async () => {
    const res = await getCampaignDetail(this.campaignId);
    if (res.code === 0 && res.data) {
      const { name } = res.data;
      this.name = name;
    }
  }

  @action
  getWithdraw = async (_, rangeStr = []) => {
    const res = await getWithdraw(rangeStr[0], rangeStr[1], undefined, this.campaignId);
    if (res.code === 0 && res.data) {
      const { impression, click, data, details } = res.data;
      this.data = details;
      this.withdrawDashboardData = {
        impression,
        click,
        data
      };
      this.withdrawChartOptions = this.transform2Chart('取量数据', details);
    }
  }

  transform2Chart = (title, data) => {
    if (!Array.isArray(data)) {
      data = [];
    }

    const categories = [];

    const series = [{
      name: '曝光',
      data: []
    }, {
      name: '点击',
      data: []
    }];

    data.forEach((item) => {
      categories.push(item.time);
      series[0].data.push(Number(item.impression));
      series[1].data.push(Number(item.click));
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
  }
}
