var dataSocket;

function startReceiveAudio(room) {
    var codec = new Speex(SPEEX_CONFIG);
    dataSocket = new WebSocket(`wss://de.meething.space/${room}`);
    dataSocket.binaryType = "arraybuffer";
    // var sink;
    var player;

    dataSocket.onopen = function(event) {
        // console.log(event);
    };

    dataSocket.onmessage = function(msg) {
        let sender = new Uint8Array(msg.data, 0, 3);
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
                flushingTime: 0.08
            });
        }
        // if (sink == undefined) {
        //     sink = new XAudioServer(CHANNELS, TO_SAMPLE_RATE, MIN_BUFFER_SIZE, MAX_BUFFER_SIZE, function(samplesRequested) {}, 0);
        // }

        let buffer = new Uint8Array(msg.data, 3, msg.data.length);
        decoded = codec.decode(buffer);

        // sink.writeAudio(decoded);
        player.feed(decoded);
        buffer = null;
    }
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
    var concatArray = concat(id, data[0])
    dataSocket.send(concatArray);
}

function concat(first, second) {
    var firstLength = first.length,
        result = new Uint8Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}