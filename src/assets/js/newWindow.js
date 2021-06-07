const { ipcRenderer } = require('electron')
const rapports = document.querySelector("#rapports");
const creer = document.querySelector("#creer");
const liste = document.querySelector("#idRapport");
const deconnexion = document.querySelector("#deconnexion")

deconnexion.addEventListener("click", (e) => {
     e.preventDefault()
     logout()
})

ipcRenderer.on("dataFromMain", (event, data) => {
    document.querySelector("#pseudo").innerHTML =  data[0]
    getRapportByVisiteurId(data);
})

ipcRenderer.on("deleteRapportFromMain", (event, data) => {
    getRapportByVisiteurId(data);
})

async function getRapportByVisiteurId(data) {
    rapports.innerHTML = ""
    liste.innerHTML = "<option value='' class='text-dark'>--Sélectionnez un rapport--</option>"
    const url = `http://localhost:3002/gsb/visiteur/${data[0]}/rapport`;
    let response = "";

    const responseJson = await fetch(url, {
        credentials: 'include'
    })
        .catch((error) => {
            console.log(`Voici mon erreur ${error}`);
        });

    if (responseJson.status === 200) {
        response = await responseJson.json();
    }

    if (response.length === 0) {
        document.querySelector("#labels").style.display = "none";
        rapports.insertAdjacentHTML("beforeend",
            `
                <p id="aucunRapport" class="text-danger fs-5 mx-auto my-auto"> Vous n'avez rédigé aucun rapport.</p>
            `
        );
    } else {
        document.querySelector("#labels").style.display = "flex";
        for (let rapport of response) {
            const date = new Date(rapport.date);

            liste.insertAdjacentHTML("beforeend",
                `
                    <option class="text-dark" value="${rapport.id}">${date.getDate()}/${date.getMonth()}/${date.getFullYear().toString().substr(2)}: ${rapport.motif.substr(0, 10)}...</option>
                `
            );

            rapports.insertAdjacentHTML("beforeEnd",
                `
                    <li>
                        <div class="card rapports${rapport.id}">
                            <div class="card-body d-flex justify-content-between py-0 px-1">
                                <div class="conteneurInfos py-1 px-0">
                                    <div class="infos infos${rapport.id} d-flex justify-content-between">
                                        <span>${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</span>
                                        <span>${rapport.motif.substr(0, 20)}...</span>
                                        <span>${rapport.bilan.substr(0, 20)}...</span>
                                    </div>
                                </div>
                                <div class="boutons d_flex justify-content-end py-1 px-0">    
                                    <button class="modifier modifierRapport${rapport.id} mr-2 text-primary bg-white"><i class="fas fa-pen"></i></button>
                                    <button class="supprimer supprimerRapport${rapport.id} text-danger bg-white"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    </li>
                `
            );

            let modifier = document.querySelector(`.modifierRapport${rapport.id}`);
            let supprimer = document.querySelector(`.supprimerRapport${rapport.id}`);
            let rapportFiche = document.querySelector(`.infos${rapport.id}`);

            rapportFiche.addEventListener("click", (e) => {
                e.preventDefault();
                ipcRenderer.send("getRapportId", [data[0], rapport.id]);
            })

            modifier.addEventListener("click", (e) => {
                e.preventDefault();
                ipcRenderer.send("updateRapportById", [data[0], rapport.id, rapport.bilan, rapport.motif]);
            })

            supprimer.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Voulez-vous vraiment supprimer ce rapport?")) {
                    rapportId = rapport.id;
                    deleteRapport(data);
                }
            });
        }
    }

    document.querySelector("#idRapport").addEventListener("change", () => {
        ipcRenderer.send("getRapportId", [data[0], document.querySelector("#idRapport").value]);
    })

    creer.addEventListener("click", (e) => {
    e.preventDefault();
    ipcRenderer.send("createRapport", data);
})
}


