function joinRoom(button) {
    changeButton(button);
    movecanvas(button);
    initXAudio();
    initVisualizer();
}

function changeButton(button) {
    var skip = true;
    if (button.id == window.room) {
        send(null, "leave");
        leaver(button.id);
        button.isListening = false;
        window.room = undefined;
        window.desc = undefined;
        skip = false;
    } else {
        button.isListening = true;
        button.classList.add("bg-red-500")
        button.classList.add("hover:bg-red-700")
        button.classList.remove("bg-green-500")
        button.classList.remove("hover:bg-green-700")
        button.textContent = "Leave"
        window.room = window.room == button.id ? undefined : button.id;
        window.desc = window.desc == button.name ? undefined : button.name;
        joiner(button.id);
        send(null, "join");
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
        leaver(button.id);
    });

}

function movecanvas(button) {
    document.getElementById(`room_card_${button.id}`).appendChild(document.getElementById("visualizer"))
}

function createRoom() {
    var title = document.getElementById("create_title").value;
    var description = document.getElementById("create_description").value;

    if (title == "") {
        var titleInput = document.getElementById("create_title")
        titleInput.setCustomValidity("Missing room title");
        titleInput.reportValidity()
        return;
    }

    if (description == "") {
        var descriptionInput = document.getElementById("create_description")
        descriptionInput.setCustomValidity("Missing room description");
        descriptionInput.reportValidity()
        return;
    }

    addRoom(title, description);
    send(null, "create")
    joinRoom(document.getElementById(title));
}

function toggleMute(button) {
    if (!window.microphoneStream) {
        return;
    }

    switch (window.microphoneStream.state) {
        case "suspended":
            button.innerHTML = `<svg class="fill-current w-4 h-4 mr-2" viewBox="0 0 24 24" id="volume-loud"><path d="M13 5v14l-5-4H3V9h5z"></path><path stroke-linecap="round" d="M13 14c1.5-1 1.5-3 0-4"></path><path d="M16 16C18.0858253 13.9141747 18.0858253 10.0858253 16 8M18 19C21.98552 15.01448 22.0076803 9.00768033 18 5"></path></svg>mute microphone`;
            window.microphoneStream.resume()
            break;
        case "running":
            button.innerHTML = `<svg class="fill-current w-4 h-4 mr-2" viewBox="0 0 24 24" id="mute"><path d="M18 10L22 14M18 14L22 10"></path><path d="M13 5v14l-5-4H3V9h5z"></path><path stroke-linecap="round" d="M13 14c1.5-1 1.5-3 0-4"></path></svg>unmute microphone`;
            window.microphoneStream.suspend()
            break;
    }
}