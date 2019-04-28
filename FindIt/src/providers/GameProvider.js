import React from 'react';
import { NavigationService } from './NavigationService';
import DeviceInfo from 'react-native-device-info';

export const GameContext = React.createContext();

export default class GameProvider extends React.Component {
    state = {
        socket: null,
        setSocket: socket => {
            this.setState({ socket });
            this.initSocket(socket);
        },

        game: null, // game state
        user: null,
        end: null,
        playerList: null
    }

    constructor(props) {
        super(props);
    }

    initSocket(socket) {
        socket.emit('login', {
            deviceId: DeviceInfo.getUniqueID()
        });

        socket.on('close-event', data => {
            socket.disconnect();
        });

        socket.on('disconnect', () => {
            NavigationService.navigate('Home');
        });

        socket.on('start-game', data => {
            console.log('game:', data);
            this.setState({ game: data }, () => {
                NavigationService.navigate('Game');
            });
        });

        socket.on('update-user', data => {
            this.setState({ user: data.user });
            console.log('user:', data.user);
        });

        socket.on('start-end', data => {
            this.setState({ end: data.data }, () => {
                NavigationService.navigate('End');
            });
        });

        socket.on('update-state', data => {
            this.setState({ game: data });
        });

        socket.on('player-list', data => {
            this.setState({ playerList: data });
        });
    }

    render() {
        return (
            <GameContext.Provider value={{
                state: this.state
            }}>
                {this.props.children}
            </GameContext.Provider>
        )
    }
}