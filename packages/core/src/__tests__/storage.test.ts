import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSecureStorage, type StorageKeyConfig } from '../storage';

// Mock expo-secure-store
const mockSetItemAsync = vi.fn();
const mockGetItemAsync = vi.fn();
const mockDeleteItemAsync = vi.fn();

vi.mock('expo-secure-store', () => ({
  setItemAsync: (...args: unknown[]) => mockSetItemAsync(...args),
  getItemAsync: (...args: unknown[]) => mockGetItemAsync(...args),
  deleteItemAsync: (...args: unknown[]) => mockDeleteItemAsync(...args),
}));

describe('Secure Storage', () => {
  const config: StorageKeyConfig = {
    TOKEN: 'auth_token',
    USER_ID: 'user_id',
    SETTINGS: 'app_settings',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSecureStorage', () => {
    it('should create storage with config', () => {
      const storage = createSecureStorage(config);
      expect(storage).toBeDefined();
      expect(storage.keys).toEqual(config);
    });

    it('should expose keys object', () => {
      const storage = createSecureStorage(config);
      expect(storage.keys.TOKEN).toBe('auth_token');
      expect(storage.keys.USER_ID).toBe('user_id');
    });
  });

  describe('String operations', () => {
    it('should save string value', async () => {
      const storage = createSecureStorage(config);
      mockSetItemAsync.mockResolvedValueOnce(undefined);

      await storage.setString('auth_token', 'test-token');

      expect(mockSetItemAsync).toHaveBeenCalledWith('auth_token', 'test-token');
    });

    it('should get string value', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('test-token');

      const result = await storage.getString('auth_token');

      expect(mockGetItemAsync).toHaveBeenCalledWith('auth_token');
      expect(result).toBe('test-token');
    });

    it('should return null for non-existent string', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce(null);

      const result = await storage.getString('non_existent');

      expect(result).toBeNull();
    });
  });

  describe('Number operations', () => {
    it('should save number value', async () => {
      const storage = createSecureStorage(config);
      mockSetItemAsync.mockResolvedValueOnce(undefined);

      await storage.setNumber('user_id', 12345);

      expect(mockSetItemAsync).toHaveBeenCalledWith('user_id', '12345');
    });

    it('should get number value', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('12345');

      const result = await storage.getNumber('user_id');

      expect(result).toBe(12345);
    });

    it('should return null for non-existent number', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce(null);

      const result = await storage.getNumber('non_existent');

      expect(result).toBeNull();
    });

    it('should parse integer correctly', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('42');

      const result = await storage.getNumber('user_id');

      expect(result).toBe(42);
    });
  });

  describe('Boolean operations', () => {
    it('should save true value', async () => {
      const storage = createSecureStorage(config);
      mockSetItemAsync.mockResolvedValueOnce(undefined);

      await storage.setBoolean('is_logged_in', true);

      expect(mockSetItemAsync).toHaveBeenCalledWith('is_logged_in', 'true');
    });

    it('should save false value', async () => {
      const storage = createSecureStorage(config);
      mockSetItemAsync.mockResolvedValueOnce(undefined);

      await storage.setBoolean('is_logged_in', false);

      expect(mockSetItemAsync).toHaveBeenCalledWith('is_logged_in', 'false');
    });

    it('should get true value', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('true');

      const result = await storage.getBoolean('is_logged_in');

      expect(result).toBe(true);
    });

    it('should get false value', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('false');

      const result = await storage.getBoolean('is_logged_in');

      expect(result).toBe(false);
    });

    it('should return null for non-existent boolean', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce(null);

      const result = await storage.getBoolean('non_existent');

      expect(result).toBeNull();
    });

    it('should return null for invalid boolean string', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('invalid');

      const result = await storage.getBoolean('is_logged_in');

      expect(result).toBeNull();
    });
  });

  describe('Object operations', () => {
    interface TestObject {
      name: string;
      age: number;
      active: boolean;
    }

    it('should save object value', async () => {
      const storage = createSecureStorage(config);
      mockSetItemAsync.mockResolvedValueOnce(undefined);

      const data: TestObject = { name: 'John', age: 30, active: true };
      await storage.setObject<TestObject>('app_settings', data);

      expect(mockSetItemAsync).toHaveBeenCalledWith('app_settings', JSON.stringify(data));
    });

    it('should get object value', async () => {
      const storage = createSecureStorage(config);
      const data: TestObject = { name: 'John', age: 30, active: true };
      mockGetItemAsync.mockResolvedValueOnce(JSON.stringify(data));

      const result = await storage.getObject<TestObject>('app_settings');

      expect(result).toEqual(data);
    });

    it('should return null for non-existent object', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce(null);

      const result = await storage.getObject<TestObject>('non_existent');

      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('invalid json');

      const result = await storage.getObject<TestObject>('app_settings');

      expect(result).toBeNull();
    });

    it('should handle complex nested objects', async () => {
      const storage = createSecureStorage(config);
      const complexData = {
        user: {
          profile: {
            name: 'John',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        metadata: {
          version: 1,
          created: new Date().toISOString(),
        },
      };
      mockGetItemAsync.mockResolvedValueOnce(JSON.stringify(complexData));

      const result = await storage.getObject<{
        user: { profile: { name: string; settings: { theme: string; notifications: boolean } } };
        metadata: { version: number; created: string };
      }>('app_settings');

      expect(result).toEqual(complexData);
    });
  });

  describe('Delete operations', () => {
    it('should delete value by key', async () => {
      const storage = createSecureStorage(config);
      mockDeleteItemAsync.mockResolvedValueOnce(undefined);

      await storage.delete('auth_token');

      expect(mockDeleteItemAsync).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('Contains operations', () => {
    it('should return true if key exists', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce('some-value');

      const result = await storage.contains('auth_token');

      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      const storage = createSecureStorage(config);
      mockGetItemAsync.mockResolvedValueOnce(null);

      const result = await storage.contains('non_existent');

      expect(result).toBe(false);
    });
  });

  describe('Clear all operations', () => {
    it('should delete all configured keys', async () => {
      const storage = createSecureStorage(config);
      mockDeleteItemAsync.mockResolvedValue(undefined);

      await storage.clearAll();

      expect(mockDeleteItemAsync).toHaveBeenCalledTimes(3);
      expect(mockDeleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(mockDeleteItemAsync).toHaveBeenCalledWith('user_id');
      expect(mockDeleteItemAsync).toHaveBeenCalledWith('app_settings');
    });

    it('should handle empty config', async () => {
      const storage = createSecureStorage({});
      mockDeleteItemAsync.mockResolvedValue(undefined);

      await storage.clearAll();

      expect(mockDeleteItemAsync).not.toHaveBeenCalled();
    });
  });

  describe('Type safety', () => {
    it('should maintain type safety for objects', async () => {
      const storage = createSecureStorage(config);
      interface TypedData {
        id: number;
        name: string;
      }

      mockGetItemAsync.mockResolvedValueOnce(JSON.stringify({ id: 1, name: 'Test' }));

      const result = await storage.getObject<TypedData>('app_settings');

      // TypeScript should recognize these as the correct types
      if (result) {
        expect(typeof result.id).toBe('number');
        expect(typeof result.name).toBe('string');
      }
    });
  });
});
