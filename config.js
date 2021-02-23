const CHANNELS = 1;
const SAMPLE_RATE = 44100
const TO_SAMPLE_RATE = 8000
const BUFFER_SIZE = 1024
const MIN_BUFFER_SIZE = 160
const MAX_BUFFER_SIZE = 360
const SPEEX_CONFIG = {
    quality: 9,
    mode: 1,
    bits_size: 120
}

const USER_CONSTRAINTS = {
    audio: {
        sampleRate: SAMPLE_RATE,
        channelCount: CHANNELS,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false
    }
}