import StepFormStore from './form/create';
import ExchangeListStore from './exchange/list';
import LoginStore from './login';
import HomeStore from './home';
import DashboardStore from './dashboard';

export default {
  stepFormStore: new StepFormStore(),
  exchagneListStore: new ExchangeListStore(),
  loginStore: new LoginStore(),
  homeStore: new HomeStore(),
  dashboardStore: new DashboardStore()
};
