import * as FileSystem from 'expo-file-system/legacy';

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: '/mock-docs/',
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  readDirectoryAsync: jest.fn(() => Promise.resolve([])),
}));

import { VaultService } from '../services/VaultService';

describe('VaultService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create vault directories if they do not exist', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

      await VaultService.initialize();

      // 5 dirs: vault root, dumps, entities, emotions, uploads
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledTimes(5);
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        expect.stringContaining('CortexFlow_Vault'),
        { intermediates: true }
      );
    });

    it('should not create directories that already exist', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

      await VaultService.initialize();

      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });
  });

  describe('saveDump', () => {
    it('should save a dump with a custom filename', async () => {
      await VaultService.saveDump('2026-04-30', 'Hello world', '2026-04-30-abc-Raw.md');

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('2026-04-30-abc-Raw.md'),
        'Hello world'
      );
    });

    it('should save a dump with default filename when none provided', async () => {
      await VaultService.saveDump('2026-04-30', 'Test content');

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('2026-04-30-Dump.md'),
        'Test content'
      );
    });
  });

  describe('readDump', () => {
    it('should read a dump by filename', async () => {
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('file content');

      const result = await VaultService.readDump('2026-04-30-Dump.md');

      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('2026-04-30-Dump.md')
      );
      expect(result).toBe('file content');
    });
  });

  describe('listDumps', () => {
    it('should list all dumps in the directory', async () => {
      (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue(['a.md', 'b.md']);

      const result = await VaultService.listDumps();

      expect(FileSystem.readDirectoryAsync).toHaveBeenCalledWith(
        expect.stringContaining('01_Daily_Dumps')
      );
      expect(result).toEqual(['a.md', 'b.md']);
    });
  });

  describe('saveEntity', () => {
    it('should save an entity markdown file', async () => {
      await VaultService.saveEntity('Work', '# Work\ncontent');

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('Work.md'),
        '# Work\ncontent'
      );
    });
  });

  describe('saveEmotion', () => {
    it('should save an emotion markdown file', async () => {
      await VaultService.saveEmotion('Anxiety', '# Anxiety\nfeeling');

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('Anxiety.md'),
        '# Anxiety\nfeeling'
      );
    });
  });

  describe('getVaultInfo', () => {
    it('should return vault directory info', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true, isDirectory: true });

      const info = await VaultService.getVaultInfo();

      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
        expect.stringContaining('CortexFlow_Vault')
      );
      expect(info).toEqual({ exists: true, isDirectory: true });
    });
  });
});
