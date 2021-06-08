const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const template = require('./src/partials/menu')
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady()
    .then(() => {
        createWindow(800, 600, './src/views/index.html', false, 'index')
    })

app.on('windows-all-closed', () => {
    if (process.platform === 'darwin') {
        app.quit()
    }
})

let windowsArray = []

const createOrShowWindow = (width, height, file, top, windowTitle) => {
    if (getWindow(windowTitle)) {
        getWindow(windowTitle).show();
    } else {
        createWindow(width, height, './src/views/' + file, top, windowTitle);
    }
}

const getWindow = (windowTitle) => {
    for (var i = 0; i < windowsArray.length; i++) {
        if (windowsArray[i].webContents.browserWindowOptions.title == windowTitle) {
            return windowsArray[i];
        }
    }
    return null;
}

const createWindow = (width, height, file, top, title) => {
    let win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        alwaysOnTop: top,
        title: title
    })
    win.loadFile(file)
    windowsArray.push(win)

    win.on("close", (e) => {
        e.preventDefault();
        win.hide();
    })
}

ipcMain.on('getRole', (event, data) => {
    createOrShowWindow(400, 600, "newWindow.html", false, 'newWindow');
    getWindow("newWindow").webContents.send('dataFromMain', data)
    getWindow("index").hide()
})

ipcMain.on('getRapportId', (event, data) => {
    createOrShowWindow(400, 600, 'ficheRapport.html', false, 'ficheRapport')
    getWindow("ficheRapport").webContents.send('rapportIdFromMain', data)
})

ipcMain.on('updateRapportById', (event, data) => {
    createOrShowWindow(400, 600, 'updateRapport.html', false, 'modifierRapport')
    getWindow("modifierRapport").webContents.send('updateRapportIdFromMain', data)
})

ipcMain.on('createRapport', (event, data) => {
    createOrShowWindow(400, 600, 'creerRapport.html', false, 'creerRapport')
    getWindow("creerRapport").webContents.send('createRapportFromMain', data)
})

ipcMain.on("deconnexion", () => {
    getWindow("index").show();
    for (var i = 0; i < windowsArray.length; i++) {
        if (windowsArray[i].webContents.browserWindowOptions.title !== "index") {
            windowsArray[i].hide();
        }
    }
})

ipcMain.on("deleteRapport", (event, data) => {
    if (getWindow("ficheRapport")) {
        getWindow("ficheRapport").hide();
    }
    getWindow("newWindow").webContents.send("deleteRapportFromMain", data)
})

ipcMain.on("createRapportClose", (event, data) => {
    getWindow("newWindow").webContents.send("dataFromMain", data);
    getWindow("creerRapport").hide()
})

ipcMain.on("updateWindowClose", () => {
    getWindow("modifierRapport").hide()
})

ipcMain.on("createWindowClose", () => {
    getWindow("creerRapport").hide()
})

ipcMain.on("rapportModifie", (event, data) => {
    if (getWindow("ficheRapport")) {
        getWindow("ficheRapport").hide()
    }
    getWindow("newWindow").webContents.send("dataFromMain", data)
    getWindow("modifierRapport").hide()
})