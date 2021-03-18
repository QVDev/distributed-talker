const CHANNELS = 1;
const SAMPLE_RATE = 44100
const TO_SAMPLE_RATE = 8000
const BUFFER_SIZE = 1024
const MIN_BUFFER_SIZE = 320
const MAX_BUFFER_SIZE = 512
const REFIL_BUFFER_SIZE = (TO_SAMPLE_RATE * 0.02375)
const SPEEX_CONFIG = {
    quality: 3,
    // mode: 0,
    // bits_size: REFIL_BUFFER_SIZE,
    complexity: 9,
    enhancement: true,
    vad: false,
    vbr: true,
    abr: 0,
    vbr_quality: 8,
    dtx: false,
    preprocess: false,
    pp_vad: false,
    pp_agc: false,
    pp_agc_level: 8000,
    pp_denoise: false,
    pp_dereverb: false,
    pp_dereverb_decay: 0,
    pp_dereverb_level: 0,
    experimental_rtcp_feedback: false
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