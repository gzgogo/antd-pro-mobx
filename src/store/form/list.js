import { extendObservable, action } from 'mobx';
import { getCampaigns, terminateCampaign } from 'util/api';

export default class ListStore {
  constructor() {
    this.reset(true);
  }

  @action
  reset = (init) => {
    const state = {
      data: [],
      loading: false // 是否显示加载状态
    };

    if (init) {
      extendObservable(this, state);
    } else {
      Object.keys(state).forEach(key => (this[key] = state[key]));
    }

    this.location = {};
    this.match = {};
    this.history = {};
  }

  @action
  onWillMount = async (location, match, history) => {
    this.reset();

    this.setRoute(location, match, history);

    this.loading = true;
    await this.getCampaigns('');
    this.loading = false;
  }

  setRoute = (location, match, history) => {
    this.location = location;
    this.match = match;
    this.history = history;
  }

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
  terminate = async (id) => {
    this.loading = true;
    await terminateCampaign(id);
    await getCampaigns('');
    this.loading = false;
  }

  @action
  async getCampaigns(name) {
    const res = await getCampaigns(name, 0, 10000);
    if (res.code === 0) {
      this.data = res.data.list;
    }
  }
}
