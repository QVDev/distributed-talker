var dataSocket;

function startReceiveAudio(room) {
    var codec = new Speex(SPEEX_CONFIG);
    dataSocket = new WebSocket(`wss://de.meething.space/${room}`);
    dataSocket.binaryType = "arraybuffer";
    // var sink;
    var player;
    var lastTime = 0;
    var jitterBuffer = new Map()

    dataSocket.onopen = function(event) {
        // console.log(event);
    };

    dataSocket.onmessage = function(msg) {
        let sender = new Uint8Array(msg.data, 0, 3);
        let time = new Uint8Array(msg.data, 3, 13);
        time = time.toString().replaceAll(',', '')


        let diff = time - lastTime
        let latency = Date.now() - time;
        // console.log("latency::" + latency);
        lastTime = time;

        // console.log(time);
        if (sender[0] == uuid.toString().charAt(0) && sender[1] == uuid.toString().charAt(1) && sender[2] == uuid.toString().charAt(2)) {
            return
        }


        if (window.launchedContext == undefined || window.launchedContext == false) {
            return;
        }
        if (player == undefined) {
            player = new PCMPlayer({
                encoding: '32bitFloat',
                channels: CHANNELS,
                sampleRate: TO_SAMPLE_RATE,
                flushingTime: 1.00
            });
        }
        // if (sink == undefined) {
        //     sink = new XAudioServer(CHANNELS, TO_SAMPLE_RATE, MIN_BUFFER_SIZE, MAX_BUFFER_SIZE, function(samplesRequested) {}, 0);
        // }

        let buffer = new Uint8Array(msg.data, 16, msg.data.length);
        jitterBuffer.set(time, buffer);

        if (jitterBuffer.size > latency) {
            var mapAsc = new Map([...jitterBuffer.entries()].sort());
            jitterBuffer.clear();
            mapAsc.forEach(value => {
                decoded = codec.decode(value);
                player.feed(decoded);
            });
        }

        // sink.writeAudio(decoded);

        buffer = null;
    }
}

function compareMaps(map1, map2) {
    var testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (var [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (JSON.stringify(testVal) !== JSON.stringify(val) || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}

function sortNumber(a, b) {
    return a - b;
}


function stopReceiveAudio() {
    dataSocket.close();
}

function sendAudio(data) {
    if (window.room == undefined ||
        dataSocket.readyState != dataSocket.OPEN ||
        gainNode.gain.value == 0) {
        return;
    }
    var id = new Uint8Array([uuid.toString().charAt(0), uuid.toString().charAt(1), uuid.toString().charAt(2)]);
    var time = Uint8Array.from(Date.now().toString());
    var prefix = concat(id, time);
    var concatArray = concat(prefix, data[0])
    dataSocket.send(concatArray);
}

function concat(first, second) {
    var firstLength = first.length,
        result = new Uint8Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}