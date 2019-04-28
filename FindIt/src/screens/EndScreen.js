import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { GameContext } from '../providers/GameProvider';
import { theme } from '../theme';
import { NavigationService } from '../providers/NavigationService';

export default class EndScreen extends React.Component {

    render() {
        return (
            <GameContext.Consumer>
                {gameContext => (
                    <Inner gameContext={gameContext} />
                )}
            </GameContext.Consumer>
        )
    }
}

class Inner extends React.Component {

    render() {
        let seconds = (this.props.gameContext.state.end.elapsedTime / 1000).toFixed(2)
        return (
            <View style={styles.wrapper}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={{flex: 1}} />

                    <Text style={styles.winnerName}>{this.props.gameContext.state.end.winner.user.name}</Text>
                    <Text style={styles.winnerSubtext}>Event Winner</Text>

                    <View style={{flex: 1}} />

                    <Text style={styles.statText}>{this.props.gameContext.state.end.winner.user.name} completed the hunt in <Text style={{color: theme.green}}>{seconds} seconds</Text></Text>

                    <View style={{flex: 3}} />

                    <TouchableOpacity onPress={this.onHomePress}>
                        <View style={styles.homeButton}>
                            <Text style={styles.homeButtonText}>Return Home</Text>
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        )
    }

    onHomePress = () => {
        NavigationService.navigate('Home');
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: theme.background
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeButton: {
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
        borderWidth: 2,
        borderColor: theme.green
    },
    homeButtonText: {
        fontSize: 14,
        color: theme.green
    },
    winnerName: {
        color: theme.green,
        fontSize: 60,
        fontWeight: '500',
        textAlign: 'center'
    },
    winnerSubtext: {
        color: '#fff',
        opacity: 0.7,
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center'
    },
    statText: {
        color: '#fff',
        opacity: 0.7,
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center'
    }
})