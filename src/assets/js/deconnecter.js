async function logout() {
    const url = `http://localhost:3002/gsb/logout`;

    const responseJson = await fetch(url, {
        credentials: 'include'
    })
    .catch((error) => {
        console.log(`Voici mon erreur ${error}`);
    });
    
    if (responseJson.status === 200) {
        mainProcess.createWindow(800, 600, './src/views/index.html', false, 'index')
        localStorage.clear()
        mainProcess.getWindow("newWindow").close()
    } 
}