import ajax from './ajax';

export function login(phone, captcha) {
  return ajax({
    url: '/api/v1/user/auth/captcha',
    method: 'post',
    data: {
      phone,
      captcha
    }
  });
}

export function getSubTypes(typeId) {
  return ajax({
    url: '/api/v1/subtypes',
    method: 'post',
    data: {
      typeId
    }
  });
}

export function createPlan(data) {
  return ajax({
    url: '/api/v1/plan/create',
    method: 'post',
    data
  });
}

export function editPlan(data) {
  return ajax({
    url: '/api/v1/plan/edit',
    method: 'post',
    data
  });
}

export function getPlanDetail(id) {
  return ajax({
    url: '/api/v1/plan/view',
    method: 'post',
    data: {
      id
    }
  });
}

export function removePlan(id) {
  return ajax({
    url: '/api/v1/plan/delete',
    method: 'post',
    data: {
      id
    }
  });
}

export function getPlans(name, pageNum, pageSize) {
  return ajax({
    url: '/api/v1/plan/list',
    method: 'get',
    params: {
      name,
      pageNum,
      pageSize
    }
  });
}

export function getSummary() {
  return ajax({
    url: '/api/v1/dashboard/summary',
    method: 'get'
  });
}

export function getWithdraw(dateBegin, dateEnd, mediaId, campaignId) {
  return ajax({
    url: '/api/v1/dashboard/report/withdraw',
    method: 'get',
    params: {
      dateBegin,
      dateEnd,
      mediaId,
      campaignId
    }
  });
}

export function getDeposit(dateBegin, dateEnd) {
  return ajax({
    url: '/api/v1/dashboard/report/deposit',
    method: 'get',
    params: {
      dateBegin,
      dateEnd
    }
  });
}

export function getCaptcha(phone) {
  return ajax({
    url: '/api/v1/captcha',
    method: 'post',
    data: {
      phone,
      type: 1
    }
  });
}

export function getMps(params) {
  return ajax({
    url: '/api/v1/mp/all',
    method: 'get',
    params
  });
}

export function getAds(params) {
  return ajax({
    url: '/api/v1/ad',
    method: 'get',
    params
  });
}

export function getSTS(params) {
  return ajax({
    url: '/api/v1/oss_sts?bucket=matrix-static',
    method: 'get',
    params
  });
}

export function createCampaign(id, data) {
  return ajax({
    url: `/api/v1/campaigns/${id}`,
    method: 'post',
    data
  });
}

export function terminateCampaign(id) {
  return ajax({
    url: `/api/v1/campaigns/${id}/termination`,
    method: 'post'
  });
}

export function getCampaignDetail(id) {
  return ajax({
    url: `/api/v1/campaigns/${id}`,
    method: 'get'
  });
}

export function putPassword(parmas) {
  return ajax({
    url: '/api/v1/user/password',
    method: 'PUT',
    parmas
  });
}

export function getADList(pageNum, parmas) {
  return ajax({
    url: '/api/v1/ad',
    method: 'GET',
    parmas
  });
}

export function postadState(id, state) {
  return ajax({
    url: `/api/v1/ad/${id}/state/${state}`,
    method: 'post'
  });
}

// export function getReportWithdraw(dateBegin, dateEnd, mediaId, campaignId, adPlacementId) {
//   return ajax({
//     url: '/api/v1/dashboard/report/withdraw',
//     method: 'get',
//     params: {
//       dateBegin,
//       dateEnd,
//       mediaId,
//       campaignId,
//       adPlacementId
//     }
//   });
// }

export function getReportDeposit(dateBegin, dateEnd, mediaId, campaignId, adPlacementId) {
  return ajax({
    url: '/api/v1/dashboard/report/deposit',
    method: 'get',
    params: {
      dateBegin,
      dateEnd,
      mediaId,
      campaignId,
      adPlacementId
    }
  });
}
