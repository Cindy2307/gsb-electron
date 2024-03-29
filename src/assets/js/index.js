const { ipcRenderer } = require('electron')
const newWindowButton = document.querySelector("#newWindow")

async function login() {

    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    
    const credential = window.btoa(login + ":" + password);
    const url = "http://localhost:3002/gsb/login";
    let response = "";

    const responseJson = await fetch(url, {
        
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + credential
        },
    })
        .catch((error) => {
            console.log(`Voici mon erreur ${error}`);
        });

    if (responseJson.status === 200) {
        response = await responseJson.json();
        ipcRenderer.send("getRole", [login]);
    }
}

newWindowButton.addEventListener("click", (e) => {
    e.preventDefault();
    login();
})

