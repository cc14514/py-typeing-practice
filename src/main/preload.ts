import { contextBridge, ipcRenderer } from 'electron';

// 向渲染进程暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 存储相关
  store: {
    get: (key: string) => ipcRenderer.invoke('store-get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('store-set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store-delete', key),
  },

  // 窗口控制
  window: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
  },

  // 应用信息
  app: {
    getVersion: () => ipcRenderer.invoke('app-version'),
  },

  // 菜单事件监听
  on: (channel: string, callback: Function) => {
    const validChannels = ['menu-new-game', 'menu-settings', 'menu-about'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, () => callback());
    }
  },

  // 移除监听器
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});