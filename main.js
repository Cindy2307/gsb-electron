const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const template = require('./src/partials/menu')
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.whenReady()
    .then(() => {
        this.createWindow(800, 600, './src/views/index.html', false, 'index')
    })

app.on('windows-all-closed', () => {
    if (process.platform === 'darwin') {
        app.quit()
    }
})

let windowsArray = []

const getWindow = (windowTitle) => {
    for (var i = 0; i < windowsArray.length; i++) {
        if (windowsArray[i].webContents.browserWindowOptions.title == windowTitle) {
        return windowsArray[i];
        }
    }
  return null;
}

exports.createWindow = (width, height, file, top, title) => {
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
    getWindow("newWindow").webContents.send('dataFromMain', data)
    getWindow("index").hide()
})

ipcMain.on('getRapportId', (event, data) => {
    console.log(data)
    getWindow("ficheRapport").webContents.send('rapportIdFromMain', data)
})

ipcMain.on('updateRapportById', (event, data) => {
    console.log(data)
    getWindow("modifierRapport").webContents.send('updateRapportIdFromMain', data)
})

ipcMain.on('createRapport', (event, data) => {
    console.log(data)
    getWindow("creerRapport").webContents.send('createRapportFromMain', data)
})