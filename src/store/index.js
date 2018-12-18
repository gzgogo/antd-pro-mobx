import BasicFormStore from './BasicFormStore';
import StepFormStore from './StepFormStore';
import SearchListStore from './SearchListStore';
import LoginStore from './login';
import HomeStore from './home';
import DashboardStore from './dashboard';

export default {
  basicFormStore: new BasicFormStore(),
  stepFormStore: new StepFormStore(),
  searchListStore: new SearchListStore(),
  loginStore: new LoginStore(),
  homeStore: new HomeStore(),
  dashboardStore: new DashboardStore()
};
