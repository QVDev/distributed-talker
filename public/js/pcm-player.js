function PCMPlayer(option) {
    this.init(option);
}

PCMPlayer.prototype.init = function(option) {
    var defaults = {
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 1000,
        audioElementId: "audio-control"
    };
    this.option = Object.assign({}, defaults, option);
    this.samples = new Float32Array();
    this.flush = this.flush.bind(this);
    this.maxValue = this.getMaxValue();
    this.typedArray = this.getTypedArray();
    this.createContext();
};

PCMPlayer.prototype.getMaxValue = function() {
    var encodings = {
        '8bitInt': 128,
        '16bitInt': 32768,
        '32bitInt': 2147483648,
        '32bitFloat': 1
    }

    return encodings[this.option.encoding] ? encodings[this.option.encoding] : encodings['16bitInt'];
};

PCMPlayer.prototype.getTypedArray = function() {
    var typedArrays = {
        '8bitInt': Int8Array,
        '16bitInt': Int16Array,
        '32bitInt': Int32Array,
        '32bitFloat': Float32Array
    }

    return typedArrays[this.option.encoding] ? typedArrays[this.option.encoding] : typedArrays['16bitInt'];
};

PCMPlayer.prototype.createContext = function() {
    this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1;

    this.startTime = this.audioCtx.currentTime;

    var audioElement = document.getElementById(this.option.audioElementId);
    if (audioElement == undefined || audioElement == null) {
        this.gainNode.connect(this.audioCtx.destination);
    } else {
        var destination = this.audioCtx.createMediaStreamDestination();
        this.gainNode.connect(destination);
        audioElement.srcObject = destination.stream;
        audioElement.play()
            .catch(error => {
                console.log(error)
            });
    }
};

PCMPlayer.prototype.isTypedArray = function(data) {
    return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer);
};

PCMPlayer.prototype.feed = function(data) {
    if (!this.isTypedArray(data)) return;
    if (this.samples.length > MIN_BUFFER_SIZE) {
        this.flush();
    }
    if ((this.startTime - this.audioCtx.currentTime) > this.option.flushingTime) {
        this.flush();
        return;
    }
    data = this.getFormatedValue(data);
    var tmp = new Float32Array(this.samples.length + data.length);
    tmp.set(this.samples, 0);
    tmp.set(data, this.samples.length);
    this.samples = tmp;
};

PCMPlayer.prototype.getFormatedValue = function(data) {
    var data = new this.typedArray(data.buffer),
        float32 = new Float32Array(data.length),
        i;

    for (i = 0; i < data.length; i++) {
        float32[i] = data[i] / this.maxValue;
    }
    return float32;
};

PCMPlayer.prototype.volume = function(volume) {
    this.gainNode.gain.value = volume;
};

PCMPlayer.prototype.destroy = function() {
    this.samples = null;
    this.audioCtx.close();
    this.audioCtx = null;
};

PCMPlayer.prototype.flush = function() {
    if (!this.samples.length) return;
    var bufferSource = this.audioCtx.createBufferSource(),
        length = this.samples.length / this.option.channels,
        audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate),
        audioData,
        channel,
        offset,
        i,
        decrement;

    for (channel = 0; channel < this.option.channels; channel++) {
        audioData = audioBuffer.getChannelData(channel);
        offset = channel;
        // decrement = 50;
        for (i = 0; i < length; i++) {
            audioData[i] = this.samples[offset];
            // /* fadein */
            // if (i < 50) {
            //     audioData[i] = (audioData[i] * i) / 50;
            // }
            // /* fadeout*/
            // if (i >= (length - 51)) {
            //     audioData[i] = (audioData[i] * decrement--) / 50;
            // }
            offset += this.option.channels;
        }
    }

    if (this.startTime < this.audioCtx.currentTime) {
        this.startTime = this.audioCtx.currentTime;
    }

    // console.log('start vs current ' + this.startTime + ' vs ' + this.audioCtx.currentTime + ' duration: ' + audioBuffer.duration + ' delay: ' + (this.startTime - this.audioCtx.currentTime));
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(this.gainNode);
    bufferSource.start(this.startTime);
    this.startTime += audioBuffer.duration;
    this.samples = new Float32Array();
};