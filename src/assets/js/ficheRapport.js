const { ipcRenderer } = require("electron");
const dateRapport = document.querySelector("#date");
const motif = document.querySelector("#motif");
const bilan = document.querySelector("#bilan");
const mofifier = document.querySelector("#modifier");
const supprimer = document.querySelector("#supprimer");
const deconnexion = document.querySelector("#deconnexion");
let rapportId;
let array;

deconnexion.addEventListener("click", (e) => {
     e.preventDefault()
     logout()
})

ipcRenderer.on("rapportIdFromMain", (event, data) => {
    document.querySelector("#pseudo").innerHTML = data[0];
    localStorage.setItem("data", data)
    getRapportById()
})

supprimer.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous vraiment supprimer ce rapport?")) {
            rapportId = array[1];
            deleteRapport(array[0]);
        }
    })

async function getRapportById() {
    array = localStorage.getItem("data").split(",");
    const url = `http://localhost:3002/gsb/rapport/${array[1]}`;
    let response = "";

    const responseJson = await fetch(url, {
        credentials: 'include'
    })
    .catch((error) => {
        console.log(`Voici mon erreur ${error}`);
    });

    if (responseJson.status === 200) {
        response = await responseJson.json();
        const date = new Date(response.date);
        const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        
        motif.innerHTML = response.motif;
        bilan.innerHTML = response.bilan;
        dateRapport.innerHTML = `${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()}`;

        modifier.addEventListener("click", (e) => {
            e.preventDefault();
            ipcRenderer.send("updateRapportById", [array[0], array[1], response.bilan, response.motif]);
        })
    }
}


