const { ipcRenderer } = require("electron");
const form = document.querySelector("form");
const bilan = document.querySelector("#bilan");
const motif = document.querySelector("#motif");
const annuler = document.querySelector("#annuler");
const deconnexion = document.querySelector("#deconnexion");
let array;

deconnexion.addEventListener("click", (e) => {
     e.preventDefault()
     logout()
})

annuler.addEventListener("click", (e) => {
    ipcRenderer.send("updateWindowClose");
});

ipcRenderer.on("updateRapportIdFromMain", (event, data) => {
    document.querySelector("#pseudo").innerHTML =  data[0]
    bilan.innerHTML = data[2];
    motif.innerHTML = data[3];
    localStorage.setItem("data", data)
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateRapport();
})

async function updateRapport() {
    array = localStorage.getItem("data").split(",");
    const url = `http://localhost:3002/gsb/rapport/${array[1]}`;
    let response = "";
    const formData = new FormData(form);
    let object = {};

    formData.forEach(function(value, key){
        object[key] = value;
    });

    const responseJson = await fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object),
        credentials: 'include'
    })
    .catch((error) => {
        console.log(`Voici mon erreur ${error}`);
    });
   
    if (responseJson.status === 200) {
        response = await responseJson.json();
        alert("Le rapport a bien été modifié.");
        ipcRenderer.send("rapportModifie", [array[0]])
    }
}


