import React from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView,
    ActivityIndicator, Animated
} from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import { GameContext } from '../providers/GameProvider';
import { theme } from '../theme';
import ProgressBar from '../components/ProgressBar';
import Countdown from '../components/Countdown';
import TopPlayer from '../components/TopPlayer';
import { Success1, Error1, Error2 } from '../providers/SoundService';

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

        this.successOpacity = new Animated.Value(0);
        this.successX = new Animated.Value(0);

        this.failureOpacity = new Animated.Value(0);
        this.failureX = new Animated.Value(0);

        this.state = {
            pictureTakenAt: 0,
            pictureResponseAt: 0
        }
    }

    componentDidMount() {
        this.props.gameContext.state.socket.on('scan-success', () => {
            this.setState({ pictureResponseAt: Date.now() });
            Success1.play();

            Animated.timing(this.successOpacity, {
                toValue: 1,
                duration: 500
            }).start();
            setTimeout(() => {
                Animated.timing(this.successX, {
                    toValue: Dimensions.get('window').width,
                    duration: 200
                }).start();
                this.successOpacity = new Animated.Value(0);
                setTimeout(() => {
                    this.successX = new Animated.Value(0);
                })
            }, 1500);
        });

        this.props.gameContext.state.socket.on('scan-failure', () => {
            this.setState({ pictureResponseAt: Date.now() });
            Error2.play();

            Animated.timing(this.failureOpacity, {
                toValue: 1,
                duration: 500
            }).start();
            setTimeout(() => {
                Animated.timing(this.failureX, {
                    toValue: Dimensions.get('window').width,
                    duration: 200
                }).start();
                this.failureOpacity = new Animated.Value(0);
                setTimeout(() => {
                    this.failureX = new Animated.Value(0);
                })
            }, 1500);
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

                        <Animated.Image 
                            style={[styles.successImage, { opacity: this.successOpacity, transform: [{translateX: this.successX}] }]} 
                            source={require('../assets/img/check1.png')}
                        />
                        <Animated.Image 
                            style={[styles.failureImage, { opacity: this.failureOpacity, transform: [{translateX: this.failureX}] }]} 
                            source={require('../assets/img/error2.png')}
                        />
                        
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
    },
    successImage: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: Dimensions.get('window').height / 2 - 40,
        left: Dimensions.get('window').width / 2 - 40
    },
    failureImage: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: Dimensions.get('window').height / 2 - 40,
        left: Dimensions.get('window').width / 2 - 40
    }
});