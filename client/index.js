const socket = io("http://"+window.location.hostname +":5000");
const messageform = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("ul#users");
const chatboxinput = document.querySelector(".chatbox input");
const useraddform = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const useraddinput = document.querySelector(".modal input");

const messages = [];
let users = [];
let listItems = document.querySelectorAll('#messagelist li');

listItems.forEach(function(item) {
    let itemWidth = item.offsetWidth;
    console.log(itemWidth);
    item.style.maxWidth = itemWidth + 'px';
});

socket.on("message_client", (data) => {
    messages.push(data);
    updateMessages();
});
socket.on("users", (_users) => {
    users=_users;
    updateUsers();
});
// what addEventListeners does is that it adds an event listener to the element that you specify 
// and when that event happens, it calls the function that you specify
// the first argument is the event that you want to listen for
// the second argument is the function that you want to call when that event happens
// the function that you specify is called a callback function
// callback functions are functions that are called when a certain event happens
messageform.addEventListener("submit", messageSubmitHandler);
useraddform.addEventListener("submit", userAddHandler);


function updateMessages(){
    messageList.textContent = "";
    for(let i=0;i<messages.length;i++){
        // let li = document.querySelector("#messagelist li");
        // let width = li.offsetWidth;
        // li.styles.maxwidth = width + "px";
        messageList.innerHTML += `
            <li>
                <p>${messages[i].user}</p>
                <p>${messages[i].message}</p>
            </li>
        `;
    }
}
function updateUsers(){
    userList.textContent = "";
    for(let i=0;i<users.length;i++){
        let node = document.createElement("LI");
        let textnode = document.createTextNode(users[i]);
        node.appendChild(textnode);
        userList.appendChild(node);
    }

}
function messageSubmitHandler(e){
    e.preventDefault();
    const message = chatboxinput.value;
    if(!message){
        return alert("Please enter a message");
    }   
    socket.emit("message", message);
    chatboxinput.value = "";
}
function userAddHandler(e){
    e.preventDefault();
    let username = useraddinput.value;
    if(!username){
        return alert("Please enter a username");
    }
    socket.emit("adduser", username);
    useraddform.classList.add("disappear");
    backdrop.classList.add("disappear");
}