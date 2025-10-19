import { Router, type Request, type Response } from 'express';
import { requireAuth, requireRole } from './auth';
import { storage } from './storage';

const router = Router();

// GET /api/admin/dashboard - Get comprehensive admin dashboard stats
router.get('/dashboard', requireAuth(), requireRole('administrator'), async (req: Request, res: Response) => {
  try {
    // Mock data for now - will be replaced with real database queries
    const dashboardStats = {
      totalRevenue: 1245890,
      revenueGrowth: 12.5,
      grossProfit: 498356,
      grossProfitMargin: 40.0,
      netProfit: 186883,
      operatingExpenses: 311473,
      totalPrescriptions: 3456,
      prescriptionGrowth: 8.3,
      inventoryValue: 425000,
      inventoryTurnover: 24.5,
      totalBranches: 5,
      activeBranches: 5,
      totalStaff: 42,
      expiredDrugsValue: 12450,
      monthlyRevenue: [
        { month: 'Jan', revenue: 95000, target: 90000 },
        { month: 'Feb', revenue: 102000, target: 95000 },
        { month: 'Mar', revenue: 98000, target: 100000 },
        { month: 'Apr', revenue: 115000, target: 105000 },
        { month: 'May', revenue: 125000, target: 110000 },
        { month: 'Jun', revenue: 132000, target: 115000 },
        { month: 'Jul', revenue: 128000, target: 120000 },
        { month: 'Aug', revenue: 145000, target: 125000 },
        { month: 'Sep', revenue: 138000, target: 130000 },
        { month: 'Oct', revenue: 152000, target: 135000 },
        { month: 'Nov', revenue: 165000, target: 140000 },
        { month: 'Dec', revenue: 175000, target: 150000 },
      ],
      branchPerformance: [
        { branch: 'Harare Central', revenue: 425000, profit: 170000, prescriptions: 1245 },
        { branch: 'Bulawayo', revenue: 325000, profit: 130000, prescriptions: 956 },
        { branch: 'Mutare', revenue: 245000, profit: 98000, prescriptions: 678 },
        { branch: 'Gweru', revenue: 185000, profit: 74000, prescriptions: 432 },
        { branch: 'Masvingo', revenue: 65890, profit: 26356, prescriptions: 145 },
      ],
      expenseBreakdown: [
        { category: 'Salaries', amount: 145000, percentage: 46.6 },
        { category: 'Rent & Utilities', amount: 62000, percentage: 19.9 },
        { category: 'Supplies', amount: 45000, percentage: 14.4 },
        { category: 'Marketing', amount: 28000, percentage: 9.0 },
        { category: 'Insurance', amount: 18000, percentage: 5.8 },
        { category: 'Other', amount: 13473, percentage: 4.3 },
      ],
      fastMovingDrugs: [
        { name: 'Paracetamol 500mg', sold: 2340, revenue: 23400 },
        { name: 'Amoxicillin 250mg', sold: 1876, revenue: 37520 },
        { name: 'Ibuprofen 400mg', sold: 1654, revenue: 28318 },
        { name: 'Metformin 500mg', sold: 1432, revenue: 35800 },
        { name: 'Atorvastatin 20mg', sold: 1287, revenue: 45045 },
      ],
    };

    res.json(dashboardStats);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Error fetching admin dashboard data' });
  }
});

// GET /api/admin/branches - Get all branches with performance metrics
router.get('/branches', requireAuth(), requireRole('administrator'), async (req: Request, res: Response) => {
  try {
    // Mock data - will be replaced with real database queries
    const branches = [
      {
        id: '1',
        name: 'Harare Central',
        location: 'Harare CBD',
        manager: 'John Doe',
        phone: '+263 24 123 4567',
        status: 'active',
        staff: 15,
        revenue: 425000,
        prescriptions: 1245,
      },
      {
        id: '2',
        name: 'Bulawayo',
        location: 'Bulawayo City Center',
        manager: 'Jane Smith',
        phone: '+263 29 234 5678',
        status: 'active',
        staff: 12,
        revenue: 325000,
        prescriptions: 956,
      },
      {
        id: '3',
        name: 'Mutare',
        location: 'Mutare Main Street',
        manager: 'Peter Johnson',
        phone: '+263 20 345 6789',
        status: 'active',
        staff: 8,
        revenue: 245000,
        prescriptions: 678,
      },
      {
        id: '4',
        name: 'Gweru',
        location: 'Gweru Shopping Complex',
        manager: 'Mary Williams',
        phone: '+263 54 456 7890',
        status: 'active',
        staff: 5,
        revenue: 185000,
        prescriptions: 432,
      },
      {
        id: '5',
        name: 'Masvingo',
        location: 'Masvingo Town',
        manager: 'David Brown',
        phone: '+263 39 567 8901',
        status: 'active',
        staff: 2,
        revenue: 65890,
        prescriptions: 145,
      },
    ];

    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ message: 'Error fetching branches' });
  }
});

// GET /api/admin/expired-drugs - Get expired drugs across all branches
router.get('/expired-drugs', requireAuth(), requireRole('administrator'), async (req: Request, res: Response) => {
  try {
    // Mock data - will be replaced with real database queries
    const expiredDrugs = [
      {
        id: '1',
        name: 'Aspirin 100mg',
        branch: 'Harare Central',
        batchNumber: 'BA123456',
        expiryDate: '2024-09-15',
        quantity: 500,
        value: 5000,
        status: 'pending_disposal',
      },
      {
        id: '2',
        name: 'Ciprofloxacin 500mg',
        branch: 'Bulawayo',
        batchNumber: 'BA234567',
        expiryDate: '2024-08-20',
        quantity: 200,
        value: 4000,
        status: 'pending_disposal',
      },
      {
        id: '3',
        name: 'Vitamin C 1000mg',
        branch: 'Mutare',
        batchNumber: 'BA345678',
        expiryDate: '2024-10-01',
        quantity: 150,
        value: 1450,
        status: 'pending_disposal',
      },
      {
        id: '4',
        name: 'Omeprazole 20mg',
        branch: 'Gweru',
        batchNumber: 'BA456789',
        expiryDate: '2024-07-30',
        quantity: 100,
        value: 2000,
        status: 'disposed',
      },
    ];

    res.json(expiredDrugs);
  } catch (error) {
    console.error('Get expired drugs error:', error);
    res.status(500).json({ message: 'Error fetching expired drugs' });
  }
});

// GET /api/admin/fast-moving-drugs - Get fast-moving drugs analytics
router.get('/fast-moving-drugs', requireAuth(), requireRole('administrator'), async (req: Request, res: Response) => {
  try {
    // Mock data - will be replaced with real database queries
    const fastMovingDrugs = {
      overall: [
        { name: 'Paracetamol 500mg', sold: 2340, revenue: 23400, velocity: 78 },
        { name: 'Amoxicillin 250mg', sold: 1876, revenue: 37520, velocity: 63 },
        { name: 'Ibuprofen 400mg', sold: 1654, revenue: 28318, velocity: 55 },
        { name: 'Metformin 500mg', sold: 1432, revenue: 35800, velocity: 48 },
        { name: 'Atorvastatin 20mg', sold: 1287, revenue: 45045, velocity: 43 },
      ],
      byBranch: [
        {
          branch: 'Harare Central',
          drugs: [
            { name: 'Paracetamol 500mg', sold: 845, revenue: 8450, velocity: 28 },
            { name: 'Amoxicillin 250mg', sold: 654, revenue: 13080, velocity: 22 },
          ],
        },
        {
          branch: 'Bulawayo',
          drugs: [
            { name: 'Ibuprofen 400mg', sold: 567, revenue: 9706, velocity: 19 },
            { name: 'Metformin 500mg', sold: 456, revenue: 11400, velocity: 15 },
          ],
        },
      ],
    };

    res.json(fastMovingDrugs);
  } catch (error) {
    console.error('Get fast-moving drugs error:', error);
    res.status(500).json({ message: 'Error fetching fast-moving drugs' });
  }
});

// POST /api/admin/generate-tax-report - Generate tax report (ZIMRA)
router.post('/generate-tax-report', requireAuth(), requireRole('administrator'), async (req: Request, res: Response) => {
  try {
    const { reportType, startDate, endDate } = req.body;

    // Mock tax report generation
    const taxReport = {
      reportType,
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      data: {
        totalRevenue: 1245890,
        vatCollected: 186883,
        incomeTax: 74753,
        withholdingTax: 24953,
        netTaxPayable: 286589,
      },
      downloadUrl: '/api/admin/downloads/tax-report-' + Date.now() + '.pdf',
    };

    res.json(taxReport);
  } catch (error) {
    console.error('Generate tax report error:', error);
    res.status(500).json({ message: 'Error generating tax report' });
  }
});

// POST /api/admin/generate-nssa-report - Generate NSSA report
router.post('/generate-nssa-report', requireAuth(), requireRole('administrator'), async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    // Mock NSSA report generation
    const nssaReport = {
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      data: {
        totalEmployees: 42,
        totalPayroll: 145000,
        employerContribution: 10150,
        employeeContribution: 10150,
        totalNSSAPayable: 20300,
      },
      downloadUrl: '/api/admin/downloads/nssa-report-' + Date.now() + '.pdf',
    };

    res.json(nssaReport);
  } catch (error) {
    console.error('Generate NSSA report error:', error);
    res.status(500).json({ message: 'Error generating NSSA report' });
  }
});

export default router;
