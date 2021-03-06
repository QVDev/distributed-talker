(function() {

    var Context = window["webkitAudioContext"] || window["mozAudioContext"] || window["AudioContext"];
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function startCapture() {
        document.removeEventListener("click", startCapture, false);
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

        function callback(_fn) {
            var fn = _fn;
            return function(stream) {
                var audioContext = new Context({ TO_SAMPLE_RATE });

                var gainNode = audioContext.createGain()
                gainNode.gain.value = 1;

                // Create an AudioNode from the stream.
                var mic = audioContext.createMediaStreamSource(stream);
                mic.channelCount = CHANNELS;
                mic.connect(gainNode)

                var processor = audioContext.createScriptProcessor(BUFFER_SIZE, CHANNELS, CHANNELS);
                gainNode.connect(processor)
                var refillBuffer = new Int16Array(REFIL_BUFFER_SIZE);

                processor.onaudioprocess = function(event) {
                    var inputBuffer = event.inputBuffer.getChannelData(0);
                    var samples = resampler.resampler(inputBuffer);

                    for (var i = 0; i < samples.length; ++i) {
                        refillBuffer[i] = Math.ceil(samples[i] * 32767);
                    }

                    fn(refillBuffer);
                }

                // mic.connect(processor);
                processor.connect(audioContext.destination);
            }
        }
        getUserMedia.call(navigator, USER_CONSTRAINTS, callback(onmicaudio), function() {});
    }
    document.addEventListener('click', startCapture, false);
})();