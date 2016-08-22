const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron')

var ipc = require('electron').ipcMain;
// Reload on change
require('electron-reload')(__dirname);
var Twitter = require('twitter')

var client = new Twitter({
    consumer_key: 'xdCmkUsr9XIiK9HXzgFhU4T9O',
    consumer_secret: '3WvQrZVHbuQKFV40cwsJs4oNeIpMWZCz8d69psvdmaXvehoElp',
    access_token_key: '767181526484201474-kAKKfFljNsUEV4Kx0YGNqUVbZs79k46',
    access_token_secret: 'iEWmLa7jBBY58e4JGOuVp4LVE0b2UquZIXiosiGjKuEyY'
})

var tweets = [];

client.stream('statuses/filter', {track: 'sport'},  function(stream) {
    stream.on('data', function(tweet) {
        tweets.push(tweet);
        console.log(tweet)
        win.webContents.send('updateStream', tweet)
    });

    stream.on('error', function(error) {
        // console.log(error);
    });
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1440, height: 900})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

    win.webContents.send('Test')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
