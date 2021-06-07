const { ipcRenderer } = require("electron");

const dateRapport = document.querySelector("#date");
const motif = document.querySelector("#motif");
const bilan = document.querySelector("#bilan");
const mofifier = document.querySelector("#modifier");
const supprimer = document.querySelector("#supprimer");
const deconnexion = document.querySelector("#deconnexion");
let rapportId;

deconnexion.addEventListener("click", (e) => {
     e.preventDefault()
     logout()
})

ipcRenderer.on("rapportIdFromMain", (event, data) => {
    document.querySelector("#pseudo").innerHTML = data[0];
    getRapportById(data)
    console.log(data)
})

async function getRapportById(data) {
    const url = `http://localhost:3002/gsb/rapport/${data[1]}`;
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

        supprimer.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Voulez-vous vraiment supprimer ce rapport?")) {
                rapportId = response.id;
                deleteRapport(data[0]);
            }
        })
    }
    
    modifier.addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("updateRapportById", data);
})
}


