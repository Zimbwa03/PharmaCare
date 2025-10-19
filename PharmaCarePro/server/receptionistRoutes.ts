import { Router, type Request, type Response } from 'express';
import { requireAuth, requireRole } from './auth';
import { storage } from './storage';

const router = Router();

// STRICT: All routes require receptionist or administrator role

// GET /api/receptionist/prescriptions/pending - Get prescriptions ready for sale
router.get('/prescriptions/pending', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    // Mock data - will be replaced with real database queries
    const pendingPrescriptions = [
      {
        id: '1',
        prescriptionNumber: 'RX20251019001',
        patientId: 'pat001',
        patientName: 'John Doe',
        status: 'dispensed',
        totalAmount: '45.50',
        dispensedAt: new Date().toISOString(),
        items: [
          {
            productId: 'prod001',
            productName: 'Paracetamol 500mg',
            quantity: 20,
            unitPrice: '0.50',
            instructions: 'Take 1 tablet twice daily after meals',
          },
          {
            productId: 'prod002',
            productName: 'Amoxicillin 250mg',
            quantity: 21,
            unitPrice: '1.50',
            instructions: 'Take 1 capsule three times daily for 7 days',
          },
        ],
      },
      {
        id: '2',
        prescriptionNumber: 'RX20251019002',
        patientId: 'pat002',
        patientName: 'Jane Smith',
        status: 'dispensed',
        totalAmount: '78.00',
        dispensedAt: new Date().toISOString(),
        items: [
          {
            productId: 'prod003',
            productName: 'Metformin 500mg',
            quantity: 60,
            unitPrice: '1.20',
            instructions: 'Take 1 tablet twice daily with meals',
          },
          {
            productId: 'prod004',
            productName: 'Atorvastatin 20mg',
            quantity: 30,
            unitPrice: '0.50',
            instructions: 'Take 1 tablet once daily at bedtime',
          },
        ],
      },
    ];

    res.json(pendingPrescriptions);
  } catch (error) {
    console.error('Get pending prescriptions error:', error);
    res.status(500).json({ message: 'Error fetching pending prescriptions' });
  }
});

// POST /api/receptionist/sales - Process a sale transaction
router.post('/sales', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { saleType, items, paymentMethod, amountPaid, change, customerName, customerPhone } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Sale must have at least one item' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Calculate totals
    let subtotal = 0;
    let totalVAT = 0;
    
    items.forEach((item: any) => {
      const itemPrice = parseFloat(item.unitPrice) * item.quantity;
      const itemVAT = itemPrice * 0.15; // 15% VAT
      subtotal += itemPrice;
      totalVAT += itemVAT;
    });

    const totalAmount = subtotal + totalVAT;

    // Generate sale number
    const saleNumber = `SALE${Date.now()}`;

    // Mock: In real implementation, this would:
    // 1. Create sale record in database
    // 2. Create sale items
    // 3. Record payment
    // 4. Update inventory (reduce stock)
    // 5. If prescription sale, mark prescription as completed
    // 6. Create audit log
    // 7. Generate receipt

    const cashierId = (req as any).dbUser?.id || (req as any).user?.id;
    
    const sale = {
      id: `sale_${Date.now()}`,
      saleNumber,
      saleType,
      cashierId,
      subtotal: subtotal.toFixed(2),
      vatAmount: totalVAT.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      amountPaid,
      change,
      paymentMethod,
      customerName,
      customerPhone,
      items,
      createdAt: new Date().toISOString(),
    };

    console.log('Sale processed:', sale);

    res.json({
      success: true,
      message: 'Sale completed successfully',
      sale,
      receipt: {
        saleNumber,
        totalAmount: totalAmount.toFixed(2),
        amountPaid,
        change,
      },
    });
  } catch (error) {
    console.error('Process sale error:', error);
    res.status(500).json({ message: 'Error processing sale' });
  }
});

// GET /api/receptionist/products/search - Search products for OTC sales
router.get('/products/search', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Mock data - will be replaced with real database queries
    const allProducts = [
      {
        id: 'prod001',
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        barcode: '1234567890',
        sellingPrice: '0.50',
        unitPrice: '0.30',
        vatPercentage: '15',
        requiresPrescription: false,
        category: 'Pain Relief',
        strength: '500mg',
        packSize: 100,
      },
      {
        id: 'prod002',
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        barcode: '1234567891',
        sellingPrice: '1.50',
        unitPrice: '1.00',
        vatPercentage: '15',
        requiresPrescription: true,
        category: 'Antibiotics',
        strength: '250mg',
        packSize: 21,
      },
      {
        id: 'prod003',
        name: 'Metformin 500mg',
        genericName: 'Metformin HCl',
        barcode: '1234567892',
        sellingPrice: '1.20',
        unitPrice: '0.80',
        vatPercentage: '15',
        requiresPrescription: true,
        category: 'Diabetes',
        strength: '500mg',
        packSize: 60,
      },
      {
        id: 'prod004',
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        barcode: '1234567893',
        sellingPrice: '0.80',
        unitPrice: '0.50',
        vatPercentage: '15',
        requiresPrescription: false,
        category: 'Pain Relief',
        strength: '400mg',
        packSize: 50,
      },
      {
        id: 'prod005',
        name: 'Vitamin C 1000mg',
        genericName: 'Ascorbic Acid',
        barcode: '1234567894',
        sellingPrice: '0.30',
        unitPrice: '0.15',
        vatPercentage: '15',
        requiresPrescription: false,
        category: 'Vitamins',
        strength: '1000mg',
        packSize: 100,
      },
    ];

    // Simple search filter
    const searchResults = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.genericName && product.genericName.toLowerCase().includes(query.toLowerCase())) ||
      (product.barcode && product.barcode.includes(query))
    );

    res.json(searchResults.slice(0, 10)); // Limit to 10 results
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

// GET /api/receptionist/shift/current - Get current shift information
router.get('/shift/current', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).dbUser?.id || (req as any).user?.id;
    
    // Mock data - will be replaced with real database queries
    const currentShift = {
      id: 'shift001',
      shiftNumber: 'SH20251019001',
      userId,
      status: 'open',
      openingCash: '500.00',
      currentCash: '650.00',
      totalSales: '150.00',
      transactionCount: 5,
      openedAt: new Date().toISOString(),
    };

    res.json(currentShift);
  } catch (error) {
    console.error('Get current shift error:', error);
    res.status(500).json({ message: 'Error fetching current shift' });
  }
});

// POST /api/receptionist/shift/open - Open a new shift
router.post('/shift/open', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { openingCash } = req.body;

    if (!openingCash || parseFloat(openingCash) < 0) {
      return res.status(400).json({ message: 'Valid opening cash amount is required' });
    }

    const userId = (req as any).dbUser?.id || (req as any).user?.id;
    const shiftNumber = `SH${Date.now()}`;

    const shift = {
      id: `shift_${Date.now()}`,
      shiftNumber,
      userId,
      status: 'open',
      openingCash,
      openedAt: new Date().toISOString(),
    };

    console.log('Shift opened:', shift);

    res.json({
      success: true,
      message: 'Shift opened successfully',
      shift,
    });
  } catch (error) {
    console.error('Open shift error:', error);
    res.status(500).json({ message: 'Error opening shift' });
  }
});

// POST /api/receptionist/shift/close - Close current shift
router.post('/shift/close', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { closingCash, notes } = req.body;

    if (!closingCash || parseFloat(closingCash) < 0) {
      return res.status(400).json({ message: 'Valid closing cash amount is required' });
    }

    // Mock calculation
    const expectedCash = 500 + 150; // opening + sales
    const variance = parseFloat(closingCash) - expectedCash;

    const shiftClosure = {
      closingCash,
      expectedCash: expectedCash.toFixed(2),
      variance: variance.toFixed(2),
      notes,
      closedAt: new Date().toISOString(),
    };

    console.log('Shift closed:', shiftClosure);

    res.json({
      success: true,
      message: 'Shift closed successfully',
      closure: shiftClosure,
    });
  } catch (error) {
    console.error('Close shift error:', error);
    res.status(500).json({ message: 'Error closing shift' });
  }
});

// GET /api/receptionist/sales/history - Get recent sales history (today)
router.get('/sales/history', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    // Mock data
    const salesHistory = [
      {
        id: 'sale001',
        saleNumber: 'SALE001',
        customerName: 'John Doe',
        totalAmount: '45.50',
        paymentMethod: 'cash',
        createdAt: new Date().toISOString(),
        items: 3,
      },
      {
        id: 'sale002',
        saleNumber: 'SALE002',
        customerName: 'Walk-in Customer',
        totalAmount: '12.00',
        paymentMethod: 'ecocash',
        createdAt: new Date().toISOString(),
        items: 1,
      },
    ];

    res.json(salesHistory);
  } catch (error) {
    console.error('Get sales history error:', error);
    res.status(500).json({ message: 'Error fetching sales history' });
  }
});

// POST /api/receptionist/quotations - Create a new quotation
router.post('/quotations', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { patientId, items, notes, validDays } = req.body;

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({ message: 'Patient is required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Quotation must have at least one item' });
    }

    // Calculate totals
    let subtotal = 0;
    let totalVAT = 0;
    
    items.forEach((item: any) => {
      const itemSubtotal = parseFloat(item.unitPrice) * item.quantity;
      const itemVAT = itemSubtotal * (parseFloat(item.vatPercentage) / 100);
      subtotal += itemSubtotal;
      totalVAT += itemVAT;
    });

    const totalAmount = subtotal + totalVAT;

    // Generate quotation number with date format: QUO-2025-0001
    const currentYear = new Date().getFullYear();
    const quotationNumber = `QUO-${currentYear}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Calculate valid until date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (validDays || 7));

    const userId = (req as any).dbUser?.id || (req as any).user?.id;
    
    const quotation = {
      id: `quot_${Date.now()}`,
      quotationNumber,
      patientId,
      createdBy: userId,
      subtotal: subtotal.toFixed(2),
      vatAmount: totalVAT.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      notes: notes || null,
      validUntil: validUntil.toISOString(),
      status: 'pending',
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log('Quotation created:', quotation);

    res.json({
      success: true,
      message: 'Quotation created successfully',
      quotation,
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(500).json({ message: 'Error creating quotation' });
  }
});

// GET /api/receptionist/quotations - Get all quotations with optional filters
router.get('/quotations', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    // Mock data - will be replaced with real database queries
    const allQuotations = [
      {
        id: 'quot001',
        quotationNumber: 'QUO-2025-0001',
        patientId: 'pat001',
        patientName: 'Tendai Moyo',
        totalAmount: '125.50',
        status: 'pending',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        items: 3,
      },
      {
        id: 'quot002',
        quotationNumber: 'QUO-2025-0002',
        patientId: 'pat002',
        patientName: 'Chipo Ndlovu',
        totalAmount: '78.00',
        status: 'pending',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: 2,
      },
      {
        id: 'quot003',
        quotationNumber: 'QUO-2025-0003',
        patientId: 'pat003',
        patientName: 'Blessing Chikwanha',
        totalAmount: '200.00',
        status: 'converted',
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: 5,
      },
    ];

    let filteredQuotations = allQuotations;

    // Filter by status
    if (status && status !== 'all') {
      filteredQuotations = filteredQuotations.filter(q => q.status === status);
    }

    // Search by patient name or quotation number
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredQuotations = filteredQuotations.filter(q =>
        q.quotationNumber.toLowerCase().includes(searchLower) ||
        q.patientName.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredQuotations);
  } catch (error) {
    console.error('Get quotations error:', error);
    res.status(500).json({ message: 'Error fetching quotations' });
  }
});

// GET /api/receptionist/quotations/:id - Get quotation details
router.get('/quotations/:id', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mock data - will be replaced with real database query
    const quotation = {
      id,
      quotationNumber: 'QUO-2025-0001',
      patientId: 'pat001',
      patientName: 'Tendai Moyo',
      patientPhone: '+263 77 123 4567',
      subtotal: '109.13',
      vatAmount: '16.37',
      totalAmount: '125.50',
      status: 'pending',
      notes: 'Customer requested price estimate for chronic medication',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: 'prod001',
          productName: 'Paracetamol 500mg',
          quantity: 100,
          unitPrice: '0.50',
          discount: 0,
          subtotal: '50.00',
          vatAmount: '7.50',
          total: '57.50',
        },
        {
          productId: 'prod003',
          productName: 'Metformin 500mg',
          quantity: 60,
          unitPrice: '1.20',
          discount: 5,
          subtotal: '68.00',
          vatAmount: '10.20',
          total: '78.20',
        },
      ],
    };

    res.json(quotation);
  } catch (error) {
    console.error('Get quotation details error:', error);
    res.status(500).json({ message: 'Error fetching quotation details' });
  }
});

// POST /api/receptionist/quotations/:id/convert - Convert quotation to sale
router.post('/quotations/:id/convert', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentMethod, amountPaid } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Mock: Fetch quotation and create sale
    // In real implementation:
    // 1. Verify quotation exists and is pending
    // 2. Check quotation is not expired
    // 3. Create sale from quotation items
    // 4. Mark quotation as converted
    // 5. Record payment
    // 6. Update inventory

    const saleNumber = `SALE${Date.now()}`;
    const userId = (req as any).dbUser?.id || (req as any).user?.id;

    const sale = {
      id: `sale_${Date.now()}`,
      saleNumber,
      quotationId: id,
      saleType: 'otc',
      cashierId: userId,
      totalAmount: '125.50',
      paymentMethod,
      amountPaid,
      change: paymentMethod === 'cash' ? parseFloat(amountPaid) - 125.50 : 0,
      createdAt: new Date().toISOString(),
    };

    console.log('Quotation converted to sale:', sale);

    res.json({
      success: true,
      message: 'Quotation converted to sale successfully',
      sale,
      receipt: {
        saleNumber,
        totalAmount: '125.50',
        amountPaid,
        change: sale.change,
      },
    });
  } catch (error) {
    console.error('Convert quotation error:', error);
    res.status(500).json({ message: 'Error converting quotation to sale' });
  }
});

// GET /api/receptionist/sales/search - Search for sales to return
router.get('/sales/search', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search by sale number or patient name
    const sales = await storage.searchSales(query.toString());

    res.json(sales);
  } catch (error) {
    console.error('Search sales error:', error);
    res.status(500).json({ message: 'Error searching sales' });
  }
});

// GET /api/receptionist/sales/:id - Get sale details for return processing
router.get('/sales/:id', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sale = await storage.getSaleWithDetails(id);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    console.error('Get sale details error:', error);
    res.status(500).json({ message: 'Error fetching sale details' });
  }
});

// POST /api/receptionist/returns - Process a return/refund
router.post('/returns', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { saleId, items, reason, refundMethod } = req.body;

    if (!saleId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Sale ID and items are required' });
    }

    if (!refundMethod) {
      return res.status(400).json({ message: 'Refund method is required' });
    }

    const userId = (req as any).dbUser?.id || (req as any).user?.id;

    const returnRecord = await storage.processReturn({
      saleId,
      items,
      reason,
      refundMethod,
      returnedBy: userId,
    });

    res.json({
      success: true,
      message: 'Return processed successfully',
      return: returnRecord,
    });
  } catch (error) {
    console.error('Process return error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error processing return' });
  }
});

// GET /api/receptionist/sales - Get sales history with filters
router.get('/sales', requireAuth(), requireRole('receptionist', 'administrator'), async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, patientId, status, limit = '50', offset = '0' } = req.query;

    const sales = await storage.getSalesHistory({
      startDate: startDate as string,
      endDate: endDate as string,
      patientId: patientId as string,
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    res.json(sales);
  } catch (error) {
    console.error('Get sales history error:', error);
    res.status(500).json({ message: 'Error fetching sales history' });
  }
});

export default router;
