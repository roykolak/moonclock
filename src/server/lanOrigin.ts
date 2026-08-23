const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const PRIVATE_IPV4 =
  /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

const PRIVATE_IPV6 = /^(fc|fd|fe8|fe9|fea|feb)/;

export function isLanOrigin(origin: string | null | undefined) {
  if (!origin) return false;

  let hostname: string;
  try {
    hostname = new URL(origin).hostname.replace(/^\[|\]$/g, "").toLowerCase();
  } catch {
    return false;
  }

  if (LOOPBACK_HOSTNAMES.has(hostname)) return true;
  if (hostname.endsWith(".local")) return true;
  if (PRIVATE_IPV4.test(hostname)) return true;
  if (PRIVATE_IPV6.test(hostname)) return true;

  return false;
}
