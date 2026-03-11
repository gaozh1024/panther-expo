import { describe, it, expect } from 'vitest';
import { createQueryClient, QueryProvider, QueryClientProvider } from '../query';
import React from 'react';

describe('createQueryClient', () => {
  it('should create query client with default options', () => {
    const client = createQueryClient();
    expect(client).toBeDefined();

    const defaultOptions = client.getDefaultOptions();
    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.queries?.retryDelay).toBe(1000);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000);
  });

  it('should apply custom config values', () => {
    const client = createQueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          staleTime: 10000,
        },
      },
    });

    const defaultOptions = client.getDefaultOptions();
    expect(defaultOptions.queries?.retry).toBe(3);
    expect(defaultOptions.queries?.staleTime).toBe(10000);
  });
});

describe('QueryProvider exports', () => {
  it('should export QueryProvider component', () => {
    expect(QueryProvider).toBeDefined();
    expect(typeof QueryProvider).toBe('function');
  });

  it('should export QueryClientProvider', () => {
    expect(QueryClientProvider).toBeDefined();
    expect(typeof QueryClientProvider).toBe('function');
  });
});
