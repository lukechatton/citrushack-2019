import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { GameContext } from '../providers/GameProvider';

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
    
    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        console.log(barcodes);
                    }}
                />

                <View style={styles.overlayWrapper}>
                    <SafeAreaView style={{flex: 1}}>
                        <View style={{flex: 1}} />
                        <View style={styles.bottomToolbar}>
                            <View style={{flex: 1}} />
                            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                                <Text style={styles.captureText}>SCAN</Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}} />
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        )
    }

    takePicture = async function () {
        if (this.camera) {
            const data = await this.camera.takePictureAsync({ quality: 0.5, base64: true });
            console.log('image response:', data);

            this.props.gameContext.state.socket.emit('scan-image', data.base64);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        // backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
        borderWidth: 2,
        borderColor: '#6ce746'
    },
    captureText: {
        fontSize: 14,
        color: '#6ce746'
    },
    overlayWrapper: {
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    bottomToolbar: {
        flexDirection: 'row',
        padding: 10
    }
});