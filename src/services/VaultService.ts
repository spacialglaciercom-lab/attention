import * as FileSystem from 'expo-file-system/legacy';

const VAULT_NAME = 'CortexFlow_Vault';
const VAULT_DIR = `${FileSystem.documentDirectory}${VAULT_NAME}/`;

const DUMPS_DIR = `${VAULT_DIR}01_Daily_Dumps/`;
const ENTITIES_DIR = `${VAULT_DIR}02_Entities/`;
const EMOTIONS_DIR = `${VAULT_DIR}03_Emotions_&_Distortions/`;
const UPLOADS_DIR = `${VAULT_DIR}04_Uploads/`;

export const VaultService = {
  async initialize() {
    const dirs = [VAULT_DIR, DUMPS_DIR, ENTITIES_DIR, EMOTIONS_DIR, UPLOADS_DIR];
    for (const dir of dirs) {
      const info = await FileSystem.getInfoAsync(dir);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
    }
  },

  async saveDump(date: string, content: string, fileName?: string) {
    const name = fileName || `${date}-Dump.md`;
    const path = `${DUMPS_DIR}${name}`;
    await FileSystem.writeAsStringAsync(path, content);
    return path;
  },

  async readDump(fileName: string) {
    const path = `${DUMPS_DIR}${fileName}`;
    return await FileSystem.readAsStringAsync(path);
  },

  async listDumps() {
    return await FileSystem.readDirectoryAsync(DUMPS_DIR);
  },

  async saveEntity(name: string, content: string) {
    const path = `${ENTITIES_DIR}${name}.md`;
    await FileSystem.writeAsStringAsync(path, content);
  },

  async saveEmotion(name: string, content: string) {
    const path = `${EMOTIONS_DIR}${name}.md`;
    await FileSystem.writeAsStringAsync(path, content);
  },


  async saveUpload(filename: string, content: string) {
    const path = `${UPLOADS_DIR}${filename}`;
    await FileSystem.writeAsStringAsync(path, content);
    return path;
  },

  async readUpload(filename: string) {
    const path = `${UPLOADS_DIR}${filename}`;
    return await FileSystem.readAsStringAsync(path);
  },

  async listUploads() {
    return await FileSystem.readDirectoryAsync(UPLOADS_DIR);
  },

  async getVaultInfo() {
    const info = await FileSystem.getInfoAsync(VAULT_DIR);
    return info;
  }
};
