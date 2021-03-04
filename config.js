const CHANNELS = 1;
const SAMPLE_RATE = 44100
const TO_SAMPLE_RATE = 8000
const BUFFER_SIZE = 1024
const MIN_BUFFER_SIZE = 320
const MAX_BUFFER_SIZE = 512
const REFIL_BUFFER_SIZE = (TO_SAMPLE_RATE * 0.02375)
const SPEEX_CONFIG = {
    quality: 8,
    // mode: 0,
    // bits_size: REFIL_BUFFER_SIZE,
    complexity: 9,
    enhancement: true,
    vad: true,
    vbr: true,
    abr: 0,
    vbr_quality: 9,
    dtx: false,
    preprocess: false,
    pp_vad: true,
    pp_agc: true,
    pp_agc_level: 8000,
    pp_denoise: true,
    pp_dereverb: false,
    pp_dereverb_decay: 0.4,
    pp_dereverb_level: 0.3,
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