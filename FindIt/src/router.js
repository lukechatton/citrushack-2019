import {
    StackNavigator,
    TabNavigator,
    SwitchNavigator,
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createAppContainer
} from "react-navigation";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";

export const createRootNavigation = () => {
    return createAppContainer(createSwitchNavigator(
        {
            Home: {
                screen: HomeScreen
            },
            Game: {
                screen: GameScreen
            }
        },
        {
            initialRouteName: 'Home'
        }
    ));
}