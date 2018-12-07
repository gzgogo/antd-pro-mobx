import { extendObservable, action } from 'mobx';
import { getSummary, getWithdraw, getDeposit } from 'util/api';

export default class ListStore {
  constructor() {
    this.reset(true);
  }

  @action
  reset = (init) => {
    const state = {
      todayDeposit: 0,
      todayWithdraw: 0,
      balance: 0,
      campaigns: 0,
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

    // this.location = {};
    // this.match = {};
    // this.history = {};
  }

  @action
  onWillMount = async (/* location, match, history */) => {
    this.reset();

    // this.setRoute(location, match, history);

    this.loading = true;
    await this.getSummary();
    await this.getWithdraw();
    await this.getDeposit();
    this.loading = false;
  }

  // setRoute = (location, match, history) => {
  //   this.location = location;
  //   this.match = match;
  //   this.history = history;
  // }

  @action
  create = () => {
    this.history.push('/project/exchangemgr/create');
  }

  @action
  search = async (values) => {
    // console.log(values);
    await this.getCampaigns(values.name);
  }

  @action
  getSummary = async () => {
    const res = await getSummary();
    if (res.code === 0) {
      const { data } = res;

      this.todayDeposit = data.todayDeposit;
      this.todayWithdraw = data.todayWithdraw;
      this.balance = data.balance;
      this.campaigns = data.campaigns;
    }
  }

  @action
  getWithdraw = async (_, rangeStr = []) => {
    const res = await getWithdraw(rangeStr[0], rangeStr[1]);
    if (res.code === 0 && res.data) {
      const { impression, click, data, details } = res.data;
      this.withdrawDashboardData = {
        impression,
        click,
        data,
        NumberTitle: '取量'
      };
      this.withdrawChartOptions = this.transform2Chart('取量数据', details);
    }
  }

  @action
  getDeposit = async (_, rangeStr = []) => {
    const res = await getDeposit(rangeStr[0], rangeStr[1]);
    if (res.code === 0 && res.data) {
      const { impression, click, data, details } = res.data;
      this.depositDashboardData = {
        impression,
        click,
        data,
        NumberTitle: '存量'
      };
      this.depositChartOptions = this.transform2Chart('存量数据', details);
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
