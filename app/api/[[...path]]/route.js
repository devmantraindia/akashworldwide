import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { SERVICES, CATEGORIES } from '@/lib/services-data';
import { signToken, hashPassword, comparePassword, getUserFromReq, verifyToken } from '@/lib/auth-server';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'digital_portal';

let client; let db; let seeded = false;

async function getDb() {
  if (db) return db;
  client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  await seed();
  return db;
}

async function seed() {
  if (seeded) return; seeded = true;
  // Super admin
  const existingAdmin = await db.collection('users').findOne({ email: 'info.akashworldwide@gmail.com' });
  if (!existingAdmin) {
    await db.collection('users').insertOne({
      id: uuid(), name: 'Admin', email: 'info.akashworldwide@gmail.com',
      password: await hashPassword('Admin@123'), role: 'super_admin', phone: '', createdAt: new Date(),
    });
  }
  // Services
  const count = await db.collection('services').countDocuments();
  if (count === 0) {
    await db.collection('services').insertMany(SERVICES.map(s => ({ ...s, _seedId: s.id })));
  }
  // Settings
  const settings = await db.collection('settings').findOne({ _id: 'global' });
  if (!settings) {
    await db.collection('settings').insertOne({
      _id: 'global',
      qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi%3A%2F%2Fpay%3Fpa%3Dpayments%40digitalportal%26pn%3DDigital%2520Portal%26cu%3DINR',
      upiId: 'payments@digitalportal',
      payeeName: 'Digital Service Portal',
    });
  }
}

function ok(data, status = 200) { return NextResponse.json(data, { status }); }
function err(message, status = 400) { return NextResponse.json({ error: message }, { status }); }

async function requireAuth(req, roles = null) {
  const u = getUserFromReq(req);
  if (!u) return { error: err('Unauthorized', 401) };
  if (roles && !roles.includes(u.role)) return { error: err('Forbidden', 403) };
  return { user: u };
}

export async function GET(req, { params }) {
  try {
    await getDb();
    const p = (await params).path || [];
    const route = p.join('/');
    const url = new URL(req.url);

    if (route === '' ) return ok({ status: 'ok', name: 'Digital Service Portal API' });

    // Public: services list
    if (route === 'services') {
      const q = url.searchParams.get('q')?.toLowerCase() || '';
      const cat = url.searchParams.get('category');
      const popular = url.searchParams.get('popular');
      let list = await db.collection('services').find({}, { projection: { _id: 0 } }).toArray();
      if (cat) list = list.filter(s => s.category === cat);
      if (popular) list = list.filter(s => s.popular);
      if (q) list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      return ok({ services: list, categories: CATEGORIES });
    }
    if (route === 'categories') return ok({ categories: CATEGORIES });
    if (route.startsWith('services/')) {
      const slug = route.split('/')[1];
      const s = await db.collection('services').findOne({ slug }, { projection: { _id: 0 } });
      if (!s) return err('Service not found', 404);
      return ok({ service: s });
    }
    if (route === 'settings/public') {
      const s = await db.collection('settings').findOne({ _id: 'global' });
      return ok({ qrImage: s.qrImage, upiId: s.upiId, payeeName: s.payeeName });
    }
    if (route === 'stats/public') {
      const services = await db.collection('services').countDocuments();
      const users = await db.collection('users').countDocuments({ role: 'customer' });
      const orders = await db.collection('orders').countDocuments();
      return ok({ services: services || 152, users: Math.max(users, 1) + 50000, partners: 500, success: 99.9, orders });
    }

    // Auth required
    if (route === 'auth/me') {
      const a = await requireAuth(req); if (a.error) return a.error;
      const user = await db.collection('users').findOne({ id: a.user.id }, { projection: { _id: 0, password: 0 } });
      return ok({ user });
    }

    if (route === 'orders') {
      const a = await requireAuth(req); if (a.error) return a.error;
      const orders = await db.collection('orders').find({ userId: a.user.id }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
      return ok({ orders });
    }
    if (route.startsWith('orders/')) {
      const id = route.split('/')[1];
      const a = await requireAuth(req); if (a.error) return a.error;
      const order = await db.collection('orders').findOne({ id }, { projection: { _id: 0 } });
      if (!order) return err('Order not found', 404);
      if (a.user.role === 'customer' && order.userId !== a.user.id) return err('Forbidden', 403);
      return ok({ order });
    }

    // Admin
    if (route === 'admin/orders') {
      const a = await requireAuth(req, ['admin', 'super_admin']); if (a.error) return a.error;
      const status = url.searchParams.get('status');
      const filter = status ? { status } : {};
      const orders = await db.collection('orders').find(filter, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
      return ok({ orders });
    }
    if (route === 'admin/stats') {
      const a = await requireAuth(req, ['admin', 'super_admin']); if (a.error) return a.error;
      const totalOrders = await db.collection('orders').countDocuments();
      const pending = await db.collection('orders').countDocuments({ status: 'VERIFICATION' });
      const processing = await db.collection('orders').countDocuments({ status: 'PROCESSING' });
      const completed = await db.collection('orders').countDocuments({ status: 'COMPLETED' });
      const customers = await db.collection('users').countDocuments({ role: 'customer' });
      const revenueAgg = await db.collection('orders').aggregate([
        { $match: { status: { $in: ['PROCESSING','APPROVED','COMPLETED'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();
      const revenue = revenueAgg[0]?.total || 0;
      // last 7 days orders chart
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
        const dn = new Date(d); dn.setDate(dn.getDate()+1);
        const c = await db.collection('orders').countDocuments({ createdAt: { $gte: d, $lt: dn } });
        days.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), orders: c });
      }
      return ok({ totalOrders, pending, processing, completed, customers, revenue, chart: days });
    }
    if (route === 'admin/customers') {
      const a = await requireAuth(req, ['admin', 'super_admin']); if (a.error) return a.error;
      const customers = await db.collection('users').find({ role: 'customer' }, { projection: { _id: 0, password: 0 } }).sort({ createdAt: -1 }).toArray();
      return ok({ customers });
    }

    return err('Route not found', 404);
  } catch (e) {
    console.error('GET error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function POST(req, { params }) {
  try {
    await getDb();
    const p = (await params).path || [];
    const route = p.join('/');
    const body = await req.json().catch(() => ({}));

    if (route === 'auth/signup') {
      const { name, email, password, phone } = body;
      if (!name || !email || !password) return err('Missing fields');
      const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (existing) return err('Email already registered');
      const user = {
        id: uuid(), name, email: email.toLowerCase(),
        password: await hashPassword(password),
        phone: phone || '', role: 'customer', createdAt: new Date(),
      };
      await db.collection('users').insertOne(user);
      const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
      const { password: _, ...safe } = user;
      return ok({ token, user: safe });
    }

    if (route === 'auth/login') {
      const { email, password } = body;
      const user = await db.collection('users').findOne({ email: (email || '').toLowerCase() });
      if (!user) return err('Invalid credentials', 401);
      const valid = await comparePassword(password, user.password);
      if (!valid) return err('Invalid credentials', 401);
      const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
      const { password: _, _id, ...safe } = user;
      return ok({ token, user: safe });
    }

    if (route === 'admin/login') {
      const { email, password } = body;
      const user = await db.collection('users').findOne({ email: (email || '').toLowerCase() });
      if (!user || !['admin','super_admin'].includes(user.role)) return err('Invalid admin credentials', 401);
      const valid = await comparePassword(password, user.password);
      if (!valid) return err('Invalid credentials', 401);
      const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
      const { password: _, _id, ...safe } = user;
      return ok({ token, user: safe });
    }

    // Create order
    if (route === 'orders') {
      const a = await requireAuth(req); if (a.error) return a.error;
      const { serviceId, formData } = body;
      const service = await db.collection('services').findOne({ slug: serviceId });
      if (!service) return err('Service not found');
      const order = {
        id: uuid(),
        userId: a.user.id,
        userName: a.user.name,
        userEmail: a.user.email,
        serviceId: service.id,
        serviceSlug: service.slug,
        serviceName: service.name,
        amount: service.price,
        status: service.price === 0 ? 'PROCESSING' : 'PENDING',
        formData: formData || {},
        payment: null,
        timeline: [{ status: 'PENDING', at: new Date(), note: 'Order created' }],
        createdAt: new Date(),
      };
      await db.collection('orders').insertOne(order);
      const { _id, ...safe } = order;
      return ok({ order: safe });
    }

    // Submit payment
    if (route.startsWith('orders/') && route.endsWith('/payment')) {
      const id = route.split('/')[1];
      const a = await requireAuth(req); if (a.error) return a.error;
      const { transactionId, name, mobile, paymentTime, screenshot } = body;
      if (!transactionId || !name || !mobile) return err('Missing payment details');
      const update = {
        status: 'VERIFICATION',
        payment: { transactionId, name, mobile, paymentTime, screenshot, submittedAt: new Date() },
      };
      await db.collection('orders').updateOne({ id, userId: a.user.id }, {
        $set: update,
        $push: { timeline: { status: 'VERIFICATION', at: new Date(), note: 'Payment submitted, awaiting admin verification' } },
      });
      const order = await db.collection('orders').findOne({ id }, { projection: { _id: 0 } });
      return ok({ order });
    }

    // Admin verify
    if (route.startsWith('admin/orders/') && (route.endsWith('/verify') || route.endsWith('/reject') || route.endsWith('/complete'))) {
      const parts = route.split('/');
      const id = parts[2];
      const action = parts[3];
      const a = await requireAuth(req, ['admin','super_admin']); if (a.error) return a.error;
      let newStatus = 'PROCESSING';
      if (action === 'reject') newStatus = 'REJECTED';
      if (action === 'complete') newStatus = 'COMPLETED';
      const note = body.note || `Admin marked as ${newStatus}`;
      await db.collection('orders').updateOne({ id }, {
        $set: { status: newStatus, verifiedBy: a.user.email, verifiedAt: new Date() },
        $push: { timeline: { status: newStatus, at: new Date(), note } },
      });
      const order = await db.collection('orders').findOne({ id }, { projection: { _id: 0 } });
      return ok({ order });
    }

    if (route === 'admin/settings') {
      const a = await requireAuth(req, ['admin','super_admin']); if (a.error) return a.error;
      const { qrImage, upiId, payeeName } = body;
      await db.collection('settings').updateOne({ _id: 'global' }, { $set: { qrImage, upiId, payeeName } });
      return ok({ ok: true });
    }

    return err('Route not found', 404);
  } catch (e) {
    console.error('POST error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function PUT(req, { params }) { return POST(req, { params }); }
export async function DELETE(req, { params }) {
  try {
    await getDb();
    const p = (await params).path || [];
    const route = p.join('/');
    if (route.startsWith('orders/')) {
      const id = route.split('/')[1];
      const a = await requireAuth(req); if (a.error) return a.error;
      await db.collection('orders').deleteOne({ id, userId: a.user.id, status: { $in: ['PENDING'] } });
      return ok({ ok: true });
    }
    return err('Route not found', 404);
  } catch (e) { return err(e.message, 500); }
}
