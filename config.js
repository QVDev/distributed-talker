const CHANNELS = 1;
const SAMPLE_RATE = 44100
const BUFFER_SIZE = 1024
const MIN_BUFFER_SIZE = 1024
const MAX_BUFFER_SIZE = 2048
const BITS_SIZE = 70
const SPEEX_CONFIG = {
    quality: 8,
    mode: 1,
    bits_size: BITS_SIZE,

}

const USER_CONSTRAINTS = {
    audio: {
        sampleRate: SAMPLE_RATE,
        sampleSize: BITS_SIZE,
        channelCount: CHANNELS,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
    }
}