import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { type RequestHandler } from 'express';
import { storage } from './storage';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function requireAuth(): RequestHandler {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized - Please log in" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      
      if (!user || !user.isActive) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found or inactive" });
      }

      (req as any).user = user;
      (req as any).dbUser = user; // For compatibility with existing routes
      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking authentication" });
    }
  };
}

export function requireRole(...allowedRoles: string[]): RequestHandler {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const normalizedUserRole = user.role.toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
      
      if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        return res.status(403).json({ 
          message: "Forbidden: Insufficient permissions",
          required: allowedRoles,
          current: user.role
        });
      }

      (req as any).user = user;
      (req as any).dbUser = user; // For compatibility with existing routes
      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking permissions" });
    }
  };
}

// Extend Express session
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
