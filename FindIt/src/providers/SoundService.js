import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);
Sound.setActive(true);

const onFinish = (err) => {
    if(err) {
        console.log('failed to load sound:', err);
    }
} 

export const Success1 = new Sound('success_1.wav', Sound.MAIN_BUNDLE, onFinish);

export const Error1 = new Sound('error_1.wav', Sound.MAIN_BUNDLE, onFinish);
export const Error2 = new Sound('error_2.mp3', Sound.MAIN_BUNDLE, onFinish);