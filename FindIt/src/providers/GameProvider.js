import React from 'react';
import { NavigationService } from './NavigationService';

export const GameContext = React.createContext();

export default class GameProvider extends React.Component {
    state = {
        socket: null,
        setSocket: socket => {
            this.setState({ socket });
            this.initSocket(socket);
        },
    }

    constructor(props) {
        super(props);
    }

    initSocket(socket) {
        socket.on('close-event', data => {
            socket.disconnect();
        });

        socket.on('disconnect', () => {
            NavigationService.navigate('Home');
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