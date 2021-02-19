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
    `<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    <div class="flex-shrink-0">
    <img class="h-12 w-12 rounded-full" src="https://avatars.dicebear.com/4.5/api/human/{0}.svg?mood[]=happy" alt="User Icon">
    </div>
    <div>
    <div class="text-xl font-medium text-black">Room {0}</div>
    <p class="text-gray-500">Talking about tech in the city</p>        
    <p class="text-gray-500">
        <img class="inline h-5 w-5" src="https://pics.freeicons.io/uploads/icons/png/12506835751543238941-64.png" alt="Listeners"> {0}
        <button id="{0}" class="mx-4 my-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onclick="joinRoom(this)">Join room</button>
    </p>    
    </div>
    </div>`;

const grid = document.getElementById("room-grid");
for (var i = 1; i < 10; i++) {
    var temp = document.createElement('div');
    temp.innerHTML = htmlRoom.format(i);
    grid.append(temp);
}