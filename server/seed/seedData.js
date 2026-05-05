const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const Log = require('../models/Log');
const InventoryItem = require('../models/InventoryItem');
const Machine = require('../models/Machine');
const WorkOrder = require('../models/WorkOrder');
const OptimizationRun = require('../models/OptimizationRun');
const Customer = require('../models/Customer');
const SalesOrder = require('../models/SalesOrder');
const Shipment = require('../models/Shipment');
const ExportDocument = require('../models/ExportDocument');
const Invoice = require('../models/Invoice');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Drop all collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
    console.log('Cleared existing data.');

    // Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@timberERP.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=111&color=fff'
    });

    const manager = await User.create({
      name: 'Erik Johanson',
      email: 'erik@timberERP.com',
      password: 'password123',
      role: 'manager',
      avatar: 'https://ui-avatars.com/api/?name=Erik+Johanson'
    });

    const operator = await User.create({
      name: 'Karl Schmidt',
      email: 'karl@timberERP.com',
      password: 'password123',
      role: 'operator',
      avatar: 'https://ui-avatars.com/api/?name=Karl+Schmidt'
    });

    // Suppliers
    const suppliers = await Supplier.insertMany([
      { supplierId: 'SUP-001', name: 'Nordic Timber AS', country: 'Norway', species: ['Pine', 'Spruce'], rating: 5, totalOrders: 12, ytdValue: 45000, status: 'active', contactEmail: 'sales@nordictimber.no' },
      { supplierId: 'SUP-002', name: 'European Oak GmbH', country: 'Germany', species: ['Oak', 'Beech'], rating: 4, totalOrders: 8, ytdValue: 32000, status: 'active', contactEmail: 'info@eurooak.de' },
      { supplierId: 'SUP-003', name: 'Pacific Hardwoods', country: 'Malaysia', species: ['Merbau', 'Teak'], rating: 5, totalOrders: 15, ytdValue: 78000, status: 'active', contactEmail: 'export@pacific-hw.my' },
      { supplierId: 'SUP-004', name: 'Amazon Forest Co.', country: 'Brazil', species: ['Mahogany', 'Acacia'], rating: 3, totalOrders: 5, ytdValue: 21000, status: 'pending', contactEmail: 'contact@amazonforest.br' },
      { supplierId: 'SUP-005', name: 'Sahara Acacia Ltd', country: 'Ghana', species: ['Acacia'], rating: 4, totalOrders: 10, ytdValue: 35000, status: 'active', contactEmail: 'ops@sahara-acacia.gh' }
    ]);

    // Purchase Orders
    const pos = [];
    for (let i = 1; i <= 20; i++) {
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      pos.push({
        poId: `PO-${1000 + i}`,
        supplier: supplier._id,
        species: supplier.species[0],
        volume: Math.floor(Math.random() * 500) + 100,
        totalAmount: Math.floor(Math.random() * 20000) + 5000,
        status: ['pending', 'approved', 'shipped', 'completed'][Math.floor(Math.random() * 4)],
        expectedDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    await PurchaseOrder.insertMany(pos);

    // Logs
    const species = ['Pine', 'Oak', 'Teak', 'Mahogany', 'Spruce', 'Merbau', 'Acacia'];
    const grades = ['A+', 'A', 'B+', 'B', 'C'];
    const logs = [];
    for (let i = 1; i <= 50; i++) {
      logs.push({
        logId: `LOG-${2000 + i}`,
        species: species[Math.floor(Math.random() * species.length)],
        grade: grades[Math.floor(Math.random() * grades.length)],
        diameter: Math.floor(Math.random() * 60) + 30,
        length: Math.floor(Math.random() * 8) + 4,
        volume: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
        location: `Yard-${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
        status: ['available', 'in_processing', 'processed'][Math.floor(Math.random() * 3)]
      });
    }
    const createdLogs = await Log.insertMany(logs);

    // Inventory Items
    await InventoryItem.insertMany([
      { sku: 'FG-001', name: 'Premium Oak Flooring', unit: 'm²', inStock: 450, reserved: 50, location: 'WH-1', unitValue: 35 },
      { sku: 'FG-002', name: 'Pine Construction Planks', unit: 'm³', inStock: 120, reserved: 20, location: 'WH-2', unitValue: 240 },
      { sku: 'FG-003', name: 'Teak Decking Boards', unit: 'm²', inStock: 300, reserved: 80, location: 'WH-1', unitValue: 55 },
      { sku: 'FG-004', name: 'Mahogany Veneer Sheets', unit: 'pcs', inStock: 500, reserved: 0, location: 'WH-3', unitValue: 12 },
      { sku: 'FG-005', name: 'Spruce Structural Beam', unit: 'm³', inStock: 80, reserved: 15, location: 'WH-2', unitValue: 310 }
    ]);

    // Machines
    await Machine.insertMany([
      { machineId: 'MAC-01', name: 'Primary Band Saw', type: 'Band Saw', status: 'active', efficiency: 92, operator: admin._id },
      { machineId: 'MAC-02', name: 'Secondary Band Saw', type: 'Band Saw', status: 'idle', efficiency: 88 },
      { machineId: 'MAC-03', name: 'Precision Circular Saw', type: 'Circular Saw', status: 'active', efficiency: 95, operator: operator._id },
      { machineId: 'MAC-04', name: 'Industrial Planer', type: 'Planer', status: 'maintenance', efficiency: 0 },
      { machineId: 'MAC-05', name: 'High-Cap Chipper', type: 'Chipper', status: 'active', efficiency: 82 }
    ]);

    // Work Orders
    const wos = [];
    for (let i = 1; i <= 10; i++) {
        wos.push({
            woId: `WO-${4000 + i}`,
            product: ['Flooring', 'Planks', 'Veneer', 'Beams'][Math.floor(Math.random() * 4)],
            quantity: Math.floor(Math.random() * 1000) + 100,
            unit: ['m²', 'm³', 'pcs'][Math.floor(Math.random() * 3)],
            species: species[Math.floor(Math.random() * species.length)],
            status: ['queued', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
            progress: Math.floor(Math.random() * 100),
            team: `Team ${['Alpha', 'Beta', 'Gamma'][Math.floor(Math.random() * 3)]}`,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
    }
    await WorkOrder.insertMany(wos);

    // Optimization Runs
    const runs = [];
    for (let i = 1; i <= 20; i++) {
        runs.push({
            runId: `RUN-${5000 + i}`,
            log: createdLogs[Math.floor(Math.random() * createdLogs.length)]._id,
            targetProduct: 'Standard Planks',
            yieldRate: parseFloat((Math.random() * 10 + 85).toFixed(2)),
            patterns: Math.floor(Math.random() * 5) + 2,
            wasteRate: parseFloat((Math.random() * 5 + 3).toFixed(2)),
            valueSaved: Math.floor(Math.random() * 300) + 50
        });
    }
    await OptimizationRun.insertMany(runs);

    // Customers
    const customers = await Customer.insertMany([
        { customerId: 'CUS-01', name: 'BuildRight UK', country: 'United Kingdom', sector: 'Construction', ytdRevenue: 125000, stage: 'customer', email: 'procurement@buildright.co.uk' },
        { customerId: 'CUS-02', name: 'Dubai Interiors', country: 'UAE', sector: 'Interiors', ytdRevenue: 85000, stage: 'negotiation', email: 'info@dubai-int.ae' },
        { customerId: 'CUS-03', name: 'Swedish Furniture Co', country: 'Sweden', sector: 'Furniture', ytdRevenue: 210000, stage: 'customer', email: 'supply@swedenfurniture.se' },
        { customerId: 'CUS-04', name: 'Global Wood Trading', country: 'Germany', sector: 'Trading', ytdRevenue: 45000, stage: 'proposal', email: 'trade@globalwood.de' },
        { customerId: 'CUS-05', name: 'New York Builders', country: 'USA', sector: 'Construction', ytdRevenue: 180000, stage: 'qualified', email: 'ops@nybuilders.com' }
    ]);

    // Sales Orders
    const salesOrdersData = [];
    for(let i=1; i<=15; i++) {
        salesOrdersData.push({
            orderId: `SO-${6000 + i}`,
            customer: customers[Math.floor(Math.random() * customers.length)]._id,
            product: 'Finished Boards',
            volume: Math.floor(Math.random() * 100) + 20,
            unit: 'm³',
            totalValue: Math.floor(Math.random() * 15000) + 3000,
            status: ['pending', 'processing', 'shipping', 'completed'][Math.floor(Math.random() * 4)]
        });
    }
    const salesOrders = await SalesOrder.insertMany(salesOrdersData);

    // Shipments
    const shipmentsData = [];
    for(let i=1; i<=6; i++) {
        shipmentsData.push({
            shipmentId: `SHP-${7000 + i}`,
            destination: ['London Port', 'Jebel Ali', 'Stockholm Port', 'New York Harbor'][Math.floor(Math.random() * 4)],
            customer: customers[Math.floor(Math.random() * customers.length)]._id,
            vessel: 'Timber Queen V1',
            eta: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: ['loading', 'transit', 'customs', 'delivered'][Math.floor(Math.random() * 4)],
            salesOrder: salesOrders[Math.floor(Math.random() * salesOrders.length)]._id
        });
    }
    const shipments = await Shipment.insertMany(shipmentsData);

    // Export Documents
    for(let i=1; i<=8; i++) {
        await ExportDocument.create({
            docId: `DOC-${8000 + i}`,
            type: ['Phytosanitary Certificate', 'Certificate of Origin', 'FSC Chain of Custody', 'Bill of Lading'][Math.floor(Math.random() * 4)],
            shipment: shipments[Math.floor(Math.random() * shipments.length)]._id,
            status: 'valid'
        });
    }

    // Invoices
    for(let i=1; i<=10; i++) {
        await Invoice.create({
            invoiceId: `INV-${9000 + i}`,
            customer: customers[Math.floor(Math.random() * customers.length)]._id,
            salesOrder: salesOrders[Math.floor(Math.random() * salesOrders.length)]._id,
            amount: Math.floor(Math.random() * 10000) + 2000,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: ['open', 'paid', 'overdue'][Math.floor(Math.random() * 3)]
        });
    }

    console.log('Seeding completed successfully.');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
