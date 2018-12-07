import { extendObservable, action } from 'mobx';
import { message } from 'antd';
import { getMps, getAds, createCampaign, getCampaignDetail } from 'util/api';

export default class CreateStore {
  constructor() {
    this.reset(true);
  }

  @action
  onWillMount = async (location, match, history) => {
    this.reset();

    this.setRoute(location, match, history);

    this.loading = true;

    await this.getMps();

    const { id } = match.params || {};
    if (id) {
      await this.restore(id);
    }

    this.loading = false;
  }

  @action
  reset = (init) => {
    const state = {
      fields: {
        name: { value: '' }, // 名称
        // remark: { value: '' }, // 备注
        // dataExchangeType: { value: 0 }, // 推广类型
        mediaId: { value: '' }, // 小程序
        adRefId: { value: '0' }, // 广告位
        // estimeateData: { value: undefined }, // 预计日均PV
        // adType: { value: 0 }, // 广告类型
        logo: { value: null }, // 上传图片
        mpCode: { value: null }, // 上传图片
        slogan: { value: '' } // 留存名称
      },

      step: 0,

      mps: [],
      ads: [],

      loading: false, // 是否显示加载状态
      adLoading: false,
      submiting: false
    };

    if (init) {
      extendObservable(this, state);
    } else {
      Object.keys(state).forEach(key => (this[key] = state[key]));
    }

    this.formValues = null;

    this.location = {};
    this.match = {};
    this.history = {};
  }

  setRoute = (location, match, history) => {
    this.location = location;
    this.match = match;
    this.history = history;
  }

  @action
  restore = async (id) => {
    const res = await getCampaignDetail(id);
    if (res.code === 0 && res.data) {
      const { name, mediaId, adRefId, ad: { logoImageUrl, redirectImageUrl, slogan } } = res.data;
      this.fields.name.value = name;
      this.fields.mediaId.value = mediaId;
      this.fields.adRefId.value = adRefId;
      this.fields.slogan.value = slogan;
      this.fields.logo.value = {
        url: logoImageUrl,
        thumbnailUrl: logoImageUrl
      };
      this.fields.mpCode.value = {
        url: redirectImageUrl,
        thumbnailUrl: redirectImageUrl
      };
    }
  }

  @action
  getMps = async () => {
    const res = await getMps();
    this.mps = res.data || [];
    if (this.mps[0]) {
      this.fields.mediaId.value = this.mps[0].id;
      // await this.getADs(this.mps[0].appName);
    }
  }

  @action
  getADs = async (mpName) => {
    this.adLoading = true;
    const res = await getAds({
      mpName
    });
    if (res.code === 0 && res.data && Array.isArray(res.data.ads)) {
      this.ads = res.data.ads;
      this.fields.adRefld.value = res.data.ads[0].adId;
    }
    this.adLoading = false;
  }

  @action
  // 表单 onChange
  onFormChange = async (changedFields) => {
    if (changedFields.mediaId) {
      await this.getADs(changedFields.mediaId.value);
    }

    this.fields = {
      ...this.fields,
      ...changedFields
    };
  }

  @action
  next = (values) => {
    this.formValues = values;
    this.step = 1;
  }

  @action
  prev = () => {
    this.step = 0;
  }

  @action
  submit = async () => {
    if (this.formValues) {
      const { id = 0 } = this.match.params || {};

      const params = {
        ...this.formValues,
        adRefId: this.fields.adRefId.value,
        ad: {
          logoImageUrl: this.formValues.logo.url,
          redirectImageUrl: this.formValues.mpCode.url,
          slogan: this.formValues.slogan
        }
      };
      const res = await createCampaign(id, params);
      if (res.code === 0) {
        message.success((this.match.params || {}).id ? '修改成功' : '创建成功');
        this.history.push('/project/exchangemgr/list');
      }
    }
  }
}
