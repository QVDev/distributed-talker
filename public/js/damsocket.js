var opt = { peers: ['https://gunptt.herokuapp.com/gun'], localStorage: false, radisk: false };
const gun = Gun(opt);

var sink;

gun.on("in", function(msg) {
    if (document.launchedContext == undefined) {
        return;
    }
    if (sink == undefined) {
        sink = new XAudioServer(1, 8000, 320, 512, function(samplesRequested) {}, 0);
    }
    // console.log(msg.data)
    let buffer = new Float32Array(Object.values(msg.data));
    // XAudioServer.prototype.callbackBasedWriteAudio(buffer);

    sink.writeAudio(buffer);
})

function send(data) {
    gun.on("out", {
        data: data
    });
}