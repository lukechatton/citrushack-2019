import { NavigationActions } from 'react-navigation';

class NavigationServiceImpl {
    navigator;

    setNavigator(navigator) {
        this.navigator = navigator;
        console.log('updated navigator.');
    }

    navigate(routeName, params) {
        this.navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params
            })
        )
    }

    goBack() {
        this.navigator.goBack();
    }
}
export const NavigationService = new NavigationServiceImpl();