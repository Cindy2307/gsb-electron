async function deleteRapport(visiteurId) {
    const url = `http://localhost:3002/gsb/rapport/${rapportId}`;
    let response = "";

    const responseJson = await fetch(url, {
        method: "DELETE",
        credentials: 'include'
    })
    .catch((error) => {
        console.log(`Voici mon erreur ${error}`);
    });
    
    if (responseJson.status === 200) {
        response = await responseJson.json();
        let notification = new Notification("Suppression de rapport", {
            body: "Le rapport a bien été supprimé."
        });
        ipcRenderer.send("deleteRapport", [visiteurId])
        await notification.show();
    } 
}