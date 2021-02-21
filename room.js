// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

var htmlRoom =
    `<div id="room_card_{0}" class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex space-x-4 relative">    
    <div class="flex-shrink-0 object-left-top">
    <img class="h-12 w-12 rounded-full" src="https://avatars.dicebear.com/4.5/api/human/{0}.svg?mood[]=happy" alt="User Icon">
    </div>
    <div>
    <div class="text-xl font-medium text-black">{0}</div>
    <p class="text-gray-500">{1}</p>
    <p id="room_parent" class="text-gray-500">   
        <img class="inline h-5 w-5" src="https://pics.freeicons.io/uploads/icons/png/12506835751543238941-64.png" alt="Listeners">
        <button id="{0}" name="{1}" class="inline mx-4 my-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onclick="joinRoom(this)">Join</button>
    </p>
    <!-- <div id="listeners_{0}" class="text-gray-500"></div> -->
    </div>    
    </div>`;

const grid = document.getElementById("room-grid");

function addRoom(title, description) {
    if (document.getElementById(title) == undefined) {
        var temp = document.createElement('div');
        temp.innerHTML = htmlRoom.format(title, description);
        grid.append(temp);
    }
}

function joiner(id) {
    var element = document.getElementById(`listeners_${id}`)
    if (element !== undefined && element !== null) {
        var counter = element.innerText;
        counter++;
        if (counter >= 0) element.innerText = counter;
    }
}

function leaver(id) {
    var element = document.getElementById(`listeners_${id}`)
    if (element !== undefined && element !== null) {
        var counter = element.innerText;
        counter--;
        if (counter >= 0) element.innerText = counter;
    }
}