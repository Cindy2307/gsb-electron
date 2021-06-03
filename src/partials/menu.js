const { app } = require('electron')

module.exports = [
    {
        label: 'Fichier',
        submenu: [
            {
                label: 'A propos',
                role: 'about'
            },
            {
                role: 'reload'
            },
            {
                role: 'forceReload'
            },
            {
                role: 'toggleDevTools'
            },
            {
                label: 'Quitter',
                click() {
                    app.quit()
                }
            }
        ]
    }
]