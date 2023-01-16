const socket = io("http://192.168.1.158:5000");

const messageform = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("ul#users");
const chatboxinput = document.querySelector(".chatbox input");
const useraddform = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const useraddinput = document.querySelector(".modal input");
const messages = [];
let users = [];


socket.on("message_client", (data) => {
    messages.push(data);
    updateMessages();
});
socket.on("users", (_users) => {
    users=_users;
    updateUsers();
});

messageform.addEventListener("submit", messageSubmitHandler);
useraddform.addEventListener("submit", userAddHandler);


function updateMessages(){
    messageList.textContent = "";
    for(let i=0;i<messages.length;i++){
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
        // userList.innerHTML += `
        //     <li>
        //         <p>
        //             ${users[i]}
        //         </p>
        //     </li>
        // `;
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