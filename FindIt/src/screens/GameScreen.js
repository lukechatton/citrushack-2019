import React from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { GameContext } from '../providers/GameProvider';
import { theme } from '../theme';
import ProgressBar from '../components/ProgressBar';
import Countdown from '../components/Countdown';
import TopPlayer from '../components/TopPlayer';

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
            pictureTakenAt: 0,
            pictureResponseAt: 0
        }
    }

    componentDidMount() {
        this.props.gameContext.state.socket.on('scan-success', () => {
            this.setState({ pictureResponseAt: Date.now() });
        });

        this.props.gameContext.state.socket.on('scan-failure', () => {
            this.setState({ pictureResponseAt: Date.now() });
        });
    }
    
    render() {
        let currentItem = '';
        if(this.props.gameContext.state.user.itemQueue && this.props.gameContext.state.user.itemQueue.length > 0) {
            currentItem = this.props.gameContext.state.user.itemQueue[0];
        }

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
                    playSoundOnCapture={true}
                />

                <View style={styles.overlayWrapper}>
                    <SafeAreaView style={{flex: 1}}>
                        <ProgressBar />
                        { this.shouldShowLoading() ? <ActivityIndicator style={styles.uploadingIndicator} color={theme.green} /> : null }
                        
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1}} />
                            <TopPlayer />
                            <View style={{flex: 4}} />
                            <Countdown endTime={this.props.gameContext.state.game.endsAt} />
                            <View style={{flex: 1}} />
                        </View>

                        <View style={styles.searchWrapper}>
                            <Text style={styles.searchText}>{ currentItem ? currentItem.name : ''}</Text>
                        </View>
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

            this.setState({ pictureTakenAt: Date.now() })
        }
    };

    shouldShowLoading() {
        if(this.state.pictureTakenAt > this.state.pictureResponseAt) {
            return true;
        } else {
            return false;
        }
    }
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
        borderColor: theme.green
    },
    captureText: {
        fontSize: 14,
        color: theme.green
    },
    overlayWrapper: {
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    bottomToolbar: {
        flexDirection: 'row',
        padding: 10
    },
    searchWrapper: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchText: {
        color: theme.green,
        fontWeight: '800',
        fontSize: 29
    },
    uploadingIndicator: {
        position: 'absolute',
        left: 30,
        top: 30
    }
});