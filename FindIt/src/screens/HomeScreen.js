import React from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
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

        this.state = {
            name: ''
        }
    }

    componentDidMount() {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            jsonp: false
        });
        this.props.gameContext.state.setSocket(socket);
    }

    render() {
        let players = [];
        if(this.props.gameContext.state.playerList) {
            for(let player of this.props.gameContext.state.playerList.players) {
                players.push(
                    <Text style={styles.playerListName}>{player.name}</Text>
                )
            }
        }

        return (
            <View style={styles.wrapper}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity onPress={this.onStart}>
                        <Text>Start</Text>
                    </TouchableOpacity>

                    <View style={styles.container}>
                        <View style={{flex: 1}} />
                        <Text style={styles.brand}>find it.</Text>
                        <Text style={styles.brandSubtext}>scavenge the world</Text>
                        <View style={{flex: 3}} />
                    </View>

                    <View style={styles.container}>
                        {players}
                    </View>

                    <View style={{flex: 1}} />

                    <View style={styles.container}>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput 
                                placeholder='Pick a username'
                                // leftIcon={{ type: 'font-awesome', name: 'phone' }}
                                value={this.state.name}
                                onChangeText={(name) => this.setState({name: name.toString()})}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={this.onUpdateUsername} style={styles.getStartedButton}>
                                <Text style={styles.getStartedText}>Change Name</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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

    onUpdateUsername = () => {
        if(this.props.gameContext.state.socket) {
            this.props.gameContext.state.socket.emit('change-username', this.state.name);
        }
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#2f2f3c',
        flex: 1
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
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
    },
    textInput: {
        paddingVertical: 18,
        backgroundColor: '#eee',
        color: '#111',
        borderRadius: 45,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        width: Dimensions.get('window').width * 0.8
    },
    getStartedButton: {
        // width: 300,
        paddingVertical: 18,
        backgroundColor: '#31ae4d',
        borderRadius: 45,
        marginTop: 20,
        width: Dimensions.get('window').width * 0.8
    },
    getStartedText: {
        color: '#e8e8e8',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center'
    },
    playerListName: {
        color: theme.green,
        opacity: 0.8,
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5
    }
});