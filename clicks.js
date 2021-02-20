function joinRoom(button) {
    window.room = button.id;
    changeButton(button);
    movecanvas(button);
    initXAudio();
    initVisualizer();
}

function changeButton(button) {
    var skip = true;
    if (button.isListening) {
        skip = false;
    } else {
        button.isListening = true;
        button.classList.add("bg-red-500")
        button.classList.add("hover:bg-red-700")
        button.classList.remove("bg-green-500")
        button.classList.remove("hover:bg-green-700")
        button.textContent = "Leave"
    }


    document.querySelectorAll('button').forEach(element => {
        if ((skip && element.id == button.id) || element.parentElement.id !== "room_parent") {
            return;
        }
        element.isListening = false;

        element.classList.remove("bg-red-500")
        element.classList.remove("hover:bg-red-700")

        element.classList.add("bg-green-500")
        element.classList.add("hover:bg-green-700")

        element.textContent = "Join"
    });

}

function movecanvas(button) {
    document.getElementById(`room_card_${button.id}`).appendChild(document.getElementById("visualizer"))
}

function createRoom() {
    console.log("create room");
}