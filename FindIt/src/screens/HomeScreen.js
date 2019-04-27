import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationService } from '../providers/NavigationService';

export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to FindIt!</Text>
                <TouchableOpacity onPress={() => NavigationService.navigate('Game') }>
                    <View style={styles.testButton}>
                        <Text style={styles.testButtonText}>Test Camera</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
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