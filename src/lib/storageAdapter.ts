function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getItem(key: string): string | null {
  return getLocalStorage()?.getItem(key) ?? null;
}

export function setItem(key: string, value: string): void {
  getLocalStorage()?.setItem(key, value);
}

export function removeItem(key: string): void {
  getLocalStorage()?.removeItem(key);
}
