(function() {

    var Context = window["webkitAudioContext"] || window["mozAudioContext"] || window["AudioContext"];
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function alreadyInited() {

    }

    function startCapture() {
        document.removeEventListener("click", startCapture, true);
        document.addEventListener("click", alreadyInited, true);
        var supported = typeof(Context) !== "undefined";
        supported &= !!(new Context()).createMediaElementSource;
        supported &= !!getUserMedia;

        if (supported) {
            gUM_startCapture();
            return;
        }
    }

    /*
     * Metrics are collected following User Timing API (2012 draft)
     */
    const NR_MEASURES_PER_SEC = 40;
    var nr_measures = 0,
        nr_samples = 0;

    function mean(d) {
        var i, j, mt = 0;
        for (i = 0, j = 0; i < d.length; ++i) {
            var m = d[i].duration;
            if (!m)
                continue;
            j++;
            mt += m;
        }
        mt = mt / j;
        if (isNaN(mt))
            mt = 0;
        return mt;
    }

    function stats() {
        var met = 0,
            mdt = 0;

        mdt = mean(performance.getEntriesByName("decode"));
        met = mean(performance.getEntriesByName("encode"));

        // Cleanup
        performance.clearMeasures();
        performance.clearMarks();

        nr_measures = 0;

        return [mdt, met];
    }

    function gUM_startCapture() {
        var codec = new Speex(SPEEX_CONFIG);

        function onmicaudio(samples) {
            var encoded, decoded;

            performance.mark("encodeStart");
            encoded = codec.encode(samples);
            performance.mark("encodeEnd");
            performance.measure("encode", "encodeStart", "encodeEnd");

            nr_samples += samples.length;
            nr_measures++;

            if (!!encoded) {
                performance.mark("decodeStart");
                decoded = codec.decode(encoded[0]);
                performance.mark("decodeEnd");
                performance.measure("decode", "decodeStart", "decodeEnd");

                send(decoded, "audio");
                decoded = null;
                // sink.writeAudio(decoded);
            }

            if (nr_measures >= NR_MEASURES_PER_SEC) {
                // var st = stats();
                // printStreamTimes(st[1], st[0], nr_samples);
            }
        }

        var resampler = new Resampler(SAMPLE_RATE, TO_SAMPLE_RATE, CHANNELS, BUFFER_SIZE);
        // var sink = new XAudioServer(1, 8000, 320, 512, function(samplesRequested) {}, 0);

        // const demoCode = async(context) => {

        // };

        function callback(_fn) {
            var fn = _fn;
            return async function(stream) {
                var audioContext = new Context({ TO_SAMPLE_RATE });

                var gainNode = audioContext.createGain()
                var lowpass = audioContext.createBiquadFilter()
                var highpass = audioContext.createBiquadFilter()
                var lowshelf = audioContext.createBiquadFilter()
                var bandpass = audioContext.createBiquadFilter()

                bandpass.type = "bandpass";
                bandpass.frequency.value = 700;
                bandpass.Q = 100

                lowshelf.type = "lowshelf";
                lowshelf.frequency.value = 1050;
                lowshelf.gain.value = 5;

                lowpass.type = "lowpass"
                lowpass.frequency.value = 1500;
                lowpass.channelCount = CHANNELS;
                lowpass.Q = 5
                    // lowpass.gain.value = 0;
                highpass.type = "highpass"
                highpass.frequency.value = 100
                lowpass.channelCount = CHANNELS;
                lowpass.Q = 5
                    // highpass.gain.value = 0

                gainNode.gain.value = 1;

                await audioContext.audioWorklet.addModule('bypass-processor.js');
                const oscillator = new OscillatorNode(audioContext);
                const bypasser = new AudioWorkletNode(audioContext, 'bypass-processor');
                var refillBuffer = new Int16Array(190);
                bypasser.port.onmessage = (event) => {
                    // Handling data from the processor.                    
                    // console.log(event.data);
                    var inputBuffer = event.data;
                    // var samples = resampler.resampler(inputBuffer);

                    for (var i = 0; i < inputBuffer.length; ++i) {
                        refillBuffer[i] = Math.ceil(inputBuffer[i] * 32767);
                    }

                    fn(refillBuffer);
                };

                bypasser.port.postMessage('Hello!');
                oscillator.connect(bypasser).connect(gainNode);
                oscillator.start();

                // Create an AudioNode from the stream.
                var mic = audioContext.createMediaStreamSource(stream);
                mic.channelCount = CHANNELS;
                // mic.connect(lowshelf)
                // bandpass.connect(lowpass)
                // lowshelf.connect(bandpass)
                // lowpass.connect(highpass)
                // highpass.connect(gainNode)




                // var processor = audioContext.createScriptProcessor(BUFFER_SIZE, CHANNELS, CHANNELS);
                // gainNode.connect(processor)
                // var refillBuffer = new Int16Array(190);

                // processor.onaudioprocess = function(event) {
                //     var inputBuffer = event.inputBuffer.getChannelData(0);
                //     var samples = resampler.resampler(inputBuffer);

                //     for (var i = 0; i < samples.length; ++i) {
                //         refillBuffer[i] = Math.ceil(samples[i] * 32767);
                //     }

                //     fn(refillBuffer);
                // }

                // mic.connect(processor);
                gainNode.connect(audioContext.destination);
            }
        }
        getUserMedia.call(navigator, USER_CONSTRAINTS, callback(onmicaudio), function() {});
    }
    document.addEventListener('click', startCapture, true);
})();