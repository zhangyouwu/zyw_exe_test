// 在第一行中，我们使用 CommonJS 语法导入了两个 Electron 模块：
// app，它控制您的应用的事件生命周期。
// BrowserWindow，它负责创建和管理应用的窗口。
const { app, BrowserWindow ,ipcMain } = require('electron');
const path = require('path');


//createWindow() 函数将您的页面加载到新的 BrowserWindow 实例中
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  ipcMain.handle('ping', () => 'pong')
  win.loadFile('index.html')
}
//在应用准备就绪时调用函数
app.whenReady().then(() => {
  createWindow();
 // 如果没有窗口打开则打开一个窗口 (macOS)
 // 与前二者相比，即使没有打开任何窗口，macOS 应用通常也会继续运行。 在没有窗口可用时调用 app 会打开一个新窗口。
 // 为了实现这一特性，可以监听模组的 activate 事件，如果没有任何活动的 BrowserWindow，调用 createWindow() 方法新建一个。
 // 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件。 要实现这个，仅监听 whenReady() 回调即可。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
//应用窗口在不同操作系统中的行为也不同。 Electron 允许您自行实现这些行为来遵循操作系统的规范，而不是采用默认的强制执行。 您可以通过监听 app 和 BrowserWindow 模组的事件，自行实现基础的应用窗口规范。
//在 Windows 和 Linux 上，我们通常希望在关闭一个应用的所有窗口后让它退出。 若要在 Electron 中实现这一点，您可以监听 window-all-closed 事件，并调用 app.quit() 来让应用退出。这不适用于 macOS。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});