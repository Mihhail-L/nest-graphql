export function getConfig(
  key: string,
  required: boolean,
  defaultValue?: string,
): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required config: ${key}`);
  }

  if (!value) {
    return defaultValue;
  }

  return value;
}

export function getNumberConfig(
  key: string,
  required: boolean,
  defaultValue?: number,
): number {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required config: ${key}`);
  }

  if (!value) {
    return defaultValue;
  }

  return parseInt(value);
}

export function getBooleanConfig(
  key: string,
  required: boolean,
  defaultValue?: boolean,
): boolean {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required config: ${key}`);
  }

  if (!value) {
    return defaultValue;
  }

  return value === 'true';
}
