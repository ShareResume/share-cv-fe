// Utility function to create a debounced wait promise with abort support
export function waitResource(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => resolve(), ms);
  
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Operation aborted'));
      }, { once: true });
    });
  }
  