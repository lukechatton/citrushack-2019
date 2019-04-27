import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Clock } from '../providers/TimeService';
import { theme } from '../theme';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: '00:00.00'
        }
    }

    componentDidMount() {
        this.frameId = setInterval(() => this.updateTime(), 10);
        this.updateTime();
    }

    componentWillUnmount() {
        clearInterval(this.frameId);
    }

    updateTime() {
        // Get todays date and time
        const now = Clock.getTime();

        // Find the distance between now and the count down date
        let distance = this.props.endTime - now;
        if(distance < 0) {
            distance = 0;
        }

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        if(minutes < 10) {
            minutes = '0' + minutes
        }

        let seconds = ((distance % (1000 * 60)) / 1000).toFixed(2);
        if(seconds < 10) {
            seconds = '0' + seconds;
        }

        this.setState({time: minutes + ':' + seconds})
    }

    render() {
        let style;
        if(this.props.style) {
            style = this.props.style;
        } else {
            style = {
                color: theme.green,
                fontWeight: '400',
                fontSize: 16,
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
            };
        }
        
        return (
            <Text style={style}>{this.state.time}</Text>
        )
    }
}