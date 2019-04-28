import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationService } from '../providers/NavigationService';
import { GameContext } from '../providers/GameProvider';
import io from 'socket.io-client';
import { SOCKET_URL } from 'react-native-dotenv';
import { theme } from '../theme';
import { SafeAreaView } from 'react-navigation';

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

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

    componentDidMount() {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            jsonp: false
        });
        this.props.gameContext.state.setSocket(socket);
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <View style={{flex: 1}} />
                    <Text style={styles.brand}>find it.</Text>
                    <Text style={styles.brandSubtext}>scavenge the world</Text>
                    <View style={{flex: 3}} />
                    <TouchableOpacity onPress={this.onStart}>
                        <Text>Start</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}} />
                </SafeAreaView>
                {/* <TouchableOpacity onPress={() => NavigationService.navigate('Game') }>
                    <View style={styles.testButton}>
                        <Text style={styles.testButtonText}>Test Camera</Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        )
    }

    onStart = () => {
        this.props.gameContext.state.socket.emit('trigger-start');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2f2f3c',
    },
    brand: {
        fontSize: 60,
        textAlign: 'center',
        marginTop: 5,
        color: theme.green,
        fontWeight: '500'
    },
    brandSubtext: {
        fontSize: 25,
        textAlign: 'center',
        color: '#918E8E'
    },
    testButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#26292d'
    },
    testButtonText: {
        color: '#fff',
        fontWeight: '600'
    }
});