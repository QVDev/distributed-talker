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
    var title = prompt("Enter room title:", "Wizards and more...");
    var data = {};
    if (title == null || title == "") {
        return;
    } else {
        data.title = title;
    }
    var description = prompt("Enter description:", "room description");
    if (description == null || description == "") {
        return;
    } else {
        data.description = description;
    }
    addRoom(title, description);
    send(null, "create")
    joinRoom(document.getElementById(title));
}