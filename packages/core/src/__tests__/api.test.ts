import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  BaseAPI,
  APIError,
  ApiErrorCode,
  type ApiRequestOptions,
  type ApiResponse,
  type BaseAPIConfig,
} from '../api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('BaseAPI', () => {
  let api: BaseAPI;

  beforeEach(() => {
    api = new BaseAPI({ baseURL: 'https://api.example.com' });
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create instance with default config', () => {
      const defaultApi = new BaseAPI();
      expect(defaultApi).toBeInstanceOf(BaseAPI);
    });

    it('should create instance with custom config', () => {
      const config: BaseAPIConfig = {
        baseURL: 'https://api.example.com',
        defaultHeaders: { 'X-Custom': 'header' },
        requireAuth: true,
        token: 'test-token',
      };
      const customApi = new BaseAPI(config);
      expect(customApi).toBeInstanceOf(BaseAPI);
    });
  });

  describe('Token management', () => {
    it('should set token', () => {
      api.setToken('new-token');
      expect(api.getToken()).toBe('new-token');
    });

    it('should get token', () => {
      api.setToken('test-token');
      expect(api.getToken()).toBe('test-token');
    });

    it('should clear token', () => {
      api.setToken('test-token');
      api.clearToken();
      expect(api.getToken()).toBeUndefined();
    });
  });

  describe('HTTP methods', () => {
    it('should make GET request', async () => {
      const mockData = { id: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      // Access protected method through subclass
      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });
      const result = await testApi.testGet<{ id: number }>('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toMatchObject({
        data: { id: 1 },
        message: 'Success',
        success: true,
      });
    });

    it('should make POST request with data', async () => {
      const mockResponse: ApiResponse<{ created: boolean }> = {
        data: { created: true },
        message: 'Created',
        success: true,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockResponse),
      });

      class TestAPI extends BaseAPI {
        public async testPost<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
          return this.post<T>(endpoint, data, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });
      const requestData = { name: 'Test' };
      await testApi.testPost('/test', requestData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );
    });

    it('should make PUT request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Updated', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testPut<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
          return this.put<T>(endpoint, data, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });
      await testApi.testPut('/test/1', { name: 'Updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should make DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Deleted', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testDelete<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.delete<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });
      await testApi.testDelete('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should make PATCH request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Patched', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testPatch<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
          return this.patch<T>(endpoint, data, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });
      await testApi.testPatch('/test/1', { name: 'Patched' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('Authentication', () => {
    it('should add Authorization header when token is set and requireAuth is true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Success', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com', requireAuth: true });
      testApi.setToken('test-token');
      await testApi.testGet('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should use token from options over instance token when requireAuth is true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Success', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({
        baseURL: 'https://api.example.com',
        token: 'instance-token',
        requireAuth: true,
      });
      await testApi.testGet('/test', { token: 'option-token' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer option-token',
          }),
        })
      );
    });

    it('should not add Authorization header when requireAuth is false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Success', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com', token: 'test-token' });
      await testApi.testGet('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should throw APIError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            message: 'Not found',
            code: 'NOT_FOUND',
          }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });

      await expect(testApi.testGet('/test')).rejects.toThrow(APIError);
    });

    it('should include error details in APIError', async () => {
      const errorDetails = { field: 'name', message: 'Required' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errorDetails,
          }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });

      try {
        await testApi.testGet('/test');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).code).toBe(ApiErrorCode.VALIDATION_ERROR);
        expect((error as APIError).statusCode).toBe(400);
        expect((error as APIError).details).toEqual(errorDetails);
      }
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({ baseURL: 'https://api.example.com' });

      await expect(testApi.testGet('/test')).rejects.toThrow(APIError);
      try {
        await testApi.testGet('/test');
      } catch (error) {
        expect((error as APIError).code).toBe(ApiErrorCode.NETWORK_ERROR);
      }
    });

    it('should map status codes to error codes correctly', async () => {
      const testCases = [
        { status: 400, expectedCode: ApiErrorCode.VALIDATION_ERROR },
        { status: 401, expectedCode: ApiErrorCode.UNAUTHORIZED },
        { status: 403, expectedCode: ApiErrorCode.FORBIDDEN },
        { status: 404, expectedCode: ApiErrorCode.NOT_FOUND },
        { status: 500, expectedCode: ApiErrorCode.SERVER_ERROR },
        { status: 502, expectedCode: ApiErrorCode.SERVER_ERROR },
        { status: 503, expectedCode: ApiErrorCode.SERVER_ERROR },
        { status: 504, expectedCode: ApiErrorCode.SERVER_ERROR },
        { status: 418, expectedCode: ApiErrorCode.UNKNOWN_ERROR },
      ];

      class TestAPI extends BaseAPI {
        public testGetErrorCode(status: number): ApiErrorCode {
          return this.getErrorCodeFromStatus(status);
        }
      }
      const testApi = new TestAPI();

      for (const { status, expectedCode } of testCases) {
        expect(testApi.testGetErrorCode(status)).toBe(expectedCode);
      }
    });
  });

  describe('Default headers', () => {
    it('should include default headers in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Success', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({
        baseURL: 'https://api.example.com',
        defaultHeaders: { 'X-Custom': 'value' },
      });
      await testApi.testGet('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom': 'value',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should merge request headers with default headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {}, message: 'Success', success: true }),
      });

      class TestAPI extends BaseAPI {
        public async testGet<T>(endpoint: string, options?: ApiRequestOptions) {
          return this.get<T>(endpoint, options);
        }
      }
      const testApi = new TestAPI({
        baseURL: 'https://api.example.com',
        defaultHeaders: { 'X-Default': 'value' },
      });
      await testApi.testGet('/test', { headers: { 'X-Request': 'override' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Default': 'value',
            'X-Request': 'override',
          }),
        })
      );
    });
  });
});

describe('APIError', () => {
  it('should create error with all properties', () => {
    const errorData = {
      message: 'Test error',
      code: ApiErrorCode.NETWORK_ERROR,
      statusCode: 500,
      details: { field: 'test' },
    };
    const error = new APIError(errorData);

    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ApiErrorCode.NETWORK_ERROR);
    expect(error.statusCode).toBe(500);
    expect(error.details).toEqual({ field: 'test' });
    expect(error.name).toBe('APIError');
  });

  it('should create error without optional properties', () => {
    const errorData = {
      message: 'Simple error',
      code: ApiErrorCode.UNKNOWN_ERROR,
    };
    const error = new APIError(errorData);

    expect(error.message).toBe('Simple error');
    expect(error.code).toBe(ApiErrorCode.UNKNOWN_ERROR);
    expect(error.statusCode).toBeUndefined();
    expect(error.details).toBeUndefined();
  });
});
