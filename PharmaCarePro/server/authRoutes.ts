import { Router, type Request, type Response } from 'express';
import { hashPassword, comparePassword, generateVerificationToken } from './auth';
import { storage } from './storage';
import { z } from 'zod';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  pharmacyBranch: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  pharmacyBranch: z.string().optional(),
  role: z.enum(['administrator', 'pharmacist', 'receptionist', 'technician', 'store_manager']),
});

// POST /api/auth/signup - Create first admin account
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);

    // Check if any users exist (first signup should be admin)
    const allUsers = await storage.getAllUsers();
    if (allUsers.length > 0) {
      return res.status(403).json({ 
        message: "Admin account already exists. Contact admin for account creation." 
      });
    }

    // Check if email exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);
    const verificationToken = generateVerificationToken();

    // Create admin user (first user is always administrator)
    // Auto-verify for now until email service is set up
    const user = await storage.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      pharmacyBranch: data.pharmacyBranch,
      role: 'administrator',
      emailVerified: true, // Auto-verify in development
      verificationToken: null,
      isActive: true,
    });

    res.status(201).json({
      message: "Admin account created successfully. You can now log in.",
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: "Error creating account" });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user by email
    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check email verification
    if (!user.emailVerified) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in",
        requiresVerification: true 
      });
    }

    // Create session
    req.session.userId = user.id;

    // Return user data (without password)
    const { password: _, verificationToken: __, ...userData } = user;
    res.json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie('connect.sid');
    res.json({ message: "Logged out successfully" });
  });
});

// GET /api/auth/user - Get current logged-in user
router.get('/user', async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    const { password: _, verificationToken: __, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// GET /api/auth/verify-email
router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: "Invalid verification token" });
  }

  try {
    // Find user by verification token
    const allUsers = await storage.getAllUsers();
    const user = allUsers.find(u => u.verificationToken === token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Update user as verified
    await storage.updateUser(user.id, {
      emailVerified: true,
      verificationToken: null,
    });

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
          .container { text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          h1 { color: #3B82F6; }
          a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✓ Email Verified!</h1>
          <p>Your email has been successfully verified.</p>
          <p>You can now log in to your account.</p>
          <a href="/login">Go to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

// POST /api/auth/create-user - Admin creates new user (Pharmacist/Receptionist)
router.post('/create-user', async (req: Request, res: Response) => {
  // Check if user is authenticated and is an administrator
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const currentUser = await storage.getUserById(req.session.userId);
    if (!currentUser || currentUser.role !== 'administrator') {
      return res.status(403).json({ message: "Only administrators can create user accounts" });
    }

    const data = createUserSchema.parse(req.body);

    // Check if email exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);
    const verificationToken = generateVerificationToken();

    // Create user (auto-verify in development until email service is set up)
    const user = await storage.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      pharmacyBranch: data.pharmacyBranch,
      role: data.role,
      emailVerified: true, // Auto-verify in development
      verificationToken: null,
      isActive: true,
    });

    res.status(201).json({
      message: "User account created successfully. They can now log in.",
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error('Create user error:', error);
    res.status(500).json({ message: "Error creating user account" });
  }
});

export default router;
