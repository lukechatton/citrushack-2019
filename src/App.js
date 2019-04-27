/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import GameProvider from './providers/GameProvider';
import { createRootNavigation } from './router';
import { NavigationService } from './providers/NavigationService';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Layout = createRootNavigation();
        return (
            <GameProvider>
                <AppWrapper>
                    {() => {
                        const Layout = createRootNavigation();
                        return <Layout ref={ navigatorRef => {
                            NavigationService.setNavigator(navigatorRef);  
                        }} />;
                    }}
                </AppWrapper>
            </GameProvider>
        );
    }
}

class AppWrapper extends Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     if(!this.props.context.state.triedLogin) {
    //         this.props.context.state.fetchUser();
    //         console.log('fetching user from app root.');
    //     }
    // }

    render() {
        return <this.props.children />
    }
}
