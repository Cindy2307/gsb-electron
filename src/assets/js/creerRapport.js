const { ipcRenderer } = require("electron");
const form = document.querySelector("form");
const logo = document.querySelector("#logo");
const deconnexion = document.querySelector("#deconnexion")

deconnexion.addEventListener("click", (e) => {
     e.preventDefault()
     logout()
})

logo.addEventListener("click", (e) => {
    e.preventDefault();
    logout()
});

ipcRenderer.on("createRapportFromMain", (event, data) => {
    document.querySelector("#bilan").value = "";
    document.querySelector("#motif").value = "";
    document.querySelector("#pseudo").innerHTML =  data[0]
    localStorage.setItem("visiteurId", data[0]);
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    createRapport();
})

async function createRapport() {
    const url = `http://localhost:3002/gsb/visiteur/${localStorage.getItem("visiteurId")}/rapport`;
    let response = "";
    const formData = new FormData(form);
    let object = {};

    formData.forEach(function (value, key) {
        object[key] = value;
    });

    const responseJson = await fetch(url, {
        credentials: 'include',
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
        .catch((error) => {
            console.log(`Voici mon erreur ${error}`);
        });

    if (responseJson.status === 200) {
        response = await responseJson.json();
        alert("Le rapport a bien été créé.");
        ipcRenderer.send("createRapportClose", [localStorage.getItem("visiteurId")]);
    }
}

