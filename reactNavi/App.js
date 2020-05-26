
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './src/HomeScreen';
import DetailsScreen from './src/DetailsScreen';
import FadeInView from './src/FadeInView';
import AccessibilityStatusExample from './src/APIs/AccessibilityStatusExample';
import Common from './src/APIs/Common';


const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
    FadeIn: FadeInView,
    Accessibility: AccessibilityStatusExample,
    Common: Common,//合集

  },
  {
    initialRouteName: 'Common',
  }
);

export default createAppContainer(AppNavigator);


