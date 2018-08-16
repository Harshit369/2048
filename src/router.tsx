import { createStackNavigator } from 'react-navigation';

import Main from './screens/Main';

const AppRoutes = createStackNavigator({
  Main: {
    screen: Main
  }
},{
  initialRouteName: 'Main',
});

export default AppRoutes;