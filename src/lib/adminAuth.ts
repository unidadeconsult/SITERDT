const STORAGE_KEY = 'rdt_admin_password';

export function getStoredAdminPassword(): string {
  return sessionStorage.getItem(STORAGE_KEY) ?? '';
}

export function setStoredAdminPassword(password: string) {
  sessionStorage.setItem(STORAGE_KEY, password);
}

export function clearStoredAdminPassword() {
  sessionStorage.removeItem(STORAGE_KEY);
}
