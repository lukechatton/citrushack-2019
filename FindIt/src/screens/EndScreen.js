import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameContext } from '../providers/GameProvider';

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
        return (
            <View style={styles.container}>
                <Text>end game</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})