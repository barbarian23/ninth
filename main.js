const { app, globalShortcut, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false, 
    }
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //mở google tool dev
  mainWindow.webContents.openDevTools();
  mainWindow.on("close", () => {
    mainWindow.webContents.send("stop-server");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  globalShortcut.register("Alt+CommandOrControl+L", () => {
    mainWindow.webContents.send("show-server-log");
  })
}).then(createWindow);
