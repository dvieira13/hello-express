import express, { Request, Response } from "express";

const router = express.Router();

export function getClientIp(req: Request): string {
  let ip: string | undefined;

  // Check x-forwarded-for first (for proxies)
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0].trim();
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0];
  }

  // Fallback
  if (!ip) {
    ip = req.socket.remoteAddress || undefined;
  }

  if (!ip) return "Unknown";

  // Normalize IPv6 localhost (::1) and IPv6-mapped IPv4 (::ffff:127.0.0.1)
  if (ip === "::1") return "127.0.0.1";
  if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");

  return ip;
}

/**
 * ROUTE-
 * GET hello message
 * /api/hello?name=Dylan
 */
router.get("/hello", (req, res) => {
  const name = req.query.name as string | undefined;
  res.send('Hello, ${name || "Guest"}');
});

/**
 * ROUTE-
 * GET IP address
 * /api/ip
 */
router.get("/ip", (req, res) => {
  const ip = getClientIp(req);
  res.json({ ip });
});

export default router;
