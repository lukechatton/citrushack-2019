import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { GameContext } from '../providers/GameProvider';
import { theme } from '../theme';

export default class extends React.Component {

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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                { this.props.gameContext.state.game.topPlayer ? (
                    <>
                        <Image style={styles.icon} source={require('../assets/img/medal2.png')} />
                        <Text style={styles.name}>{this.props.gameContext.state.game.topPlayer.user.name} - {this.props.gameContext.state.game.topPlayer.score}</Text>
                    </>
                ) : null }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20
    },
    name: {
        color: theme.green,
        fontSize: 16,
        marginLeft: 5
    }
})