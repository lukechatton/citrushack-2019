import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GameContext } from '../providers/GameProvider';
import { theme } from '../theme';

export default class ProgressBar extends React.Component {

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
    constructor(props) {
        super(props);
    }

    render() {
        const ticks = [];
        for(let i = itemCount; i > 0; i--) {
            if(this.props.gameContext.state.user.score < i - 1) {
                ticks.push(
                    <View style={[styles.tick, styles.tickIncomplete]} key={i} />
                )
            } else {
                ticks.push(
                    <View style={[styles.tick, styles.tickComplete]} key={i} />
                )
            }
        }
        return (
            <View style={styles.wrapper}>
                {ticks}
            </View>
        )
    }
}

const heightMinimizer = 60;
const itemCount = 5;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'column',
        position: 'absolute',
        right: 0,
        top: itemCount * heightMinimizer / 2
    },
    tick: {
        width: 10,
        height: (Dimensions.get('window').height / itemCount) - heightMinimizer
    },
    tickIncomplete: {
        borderColor: '#fff',
        borderWidth: 1,
        opacity: 0.2
    },
    tickComplete: {
        backgroundColor: theme.green,
    }
})