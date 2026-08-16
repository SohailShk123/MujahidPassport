import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
// import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

let clientPromise

const db = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not configured')
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGO_URL).connect()
  }

  return (await clientPromise).db()
}

const json = (data, status = 200) =>
  NextResponse.json(data, { status })

const isAuthed = (request) =>
  request.cookies.get('passport_session')?.value === 'demo-session'

const guard = (request) =>
  isAuthed(request)
    ? null
    : json({ error: 'Unauthorized' }, 401)

const safe = (item) => ({
  ...item,
  _id: item._id?.toString?.() || item._id,
})

const today = new Date().toISOString().slice(0, 10)

export async function GET(request) {
  const denied = guard(request)

  if (denied) return denied

  try {
    const database = await db()
    const url = new URL(request.url)
    const path = url.pathname

    if (path.endsWith('/api/auth')) {
      return json({ authenticated: true })
    }

    const customers = await database
      .collection('customers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    if (path.endsWith('/api/stats')) {
      const totalIncome = customers.reduce(
        (a, c) => a + Number(c.paidAmount || 0),
        0,
      )

      const pending = customers.reduce(
        (a, c) =>
          a +
          Math.max(
            0,
            Number(c.totalAmount || 0) -
              Number(c.paidAmount || 0),
          ),
        0,
      )

      return json({
        totalCustomers: customers.length,
        newCases: customers.filter(
          (c) => c.status === 'New',
        ).length,
        documentsPending: customers.filter(
          (c) => c.status === 'Documents Pending',
        ).length,
        appointments: customers.filter(
          (c) => c.appointmentDate === today,
        ).length,
        completed: customers.filter(
          (c) => c.status === 'Completed',
        ).length,
        rejected: customers.filter(
          (c) => c.status === 'Rejected',
        ).length,
        totalIncome,
        pendingPayments: pending,
        customers: customers.slice(0, 5).map(safe),
        todayAppointments: customers
          .filter((c) => c.appointmentDate === today)
          .map(safe),
      })
    }

    if (path.endsWith('/api/customers')) {
      return json(customers.map(safe))
    }

    if (path.endsWith('/api/appointments')) {
      return json(
        customers
          .filter((c) => c.appointmentDate)
          .map(safe),
      )
    }

    if (path.endsWith('/api/reminders')) {
      return json(
        customers
          .filter((c) => c.appointmentDate)
          .map(safe),
      )
    }

    if (path.endsWith('/api/export')) {
      const fields = [
        'fileNumber',
        'fullName',
        'mobile',
        'passportType',
        'appointmentDate',
        'status',
        'totalAmount',
        'paidAmount',
        'balance',
      ]

      const csv = [
        fields.join(','),
        ...customers.map((c) =>
          fields
            .map((f) => JSON.stringify(c[f] ?? ''))
            .join(','),
        ),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition':
            'attachment; filename=passportdesk-customers.csv',
        },
      })
    }

    return json({ error: 'Not found' }, 404)
  } catch (error) {
    return json(
      {
        error: error.message || 'Server error',
      },
      500,
    )
  }
}

export async function POST(request) {
  const path = new URL(request.url).pathname

  if (path.endsWith('/api/login')) {
    const body = await request.json()

    const username =
      process.env.CRM_USERNAME || 'admin'

    const password =
      process.env.CRM_PASSWORD || 'admin123'

    if (
      body.username !== username ||
      body.password !== password
    ) {
      return json(
        {
          error: 'Invalid username or password',
        },
        401,
      )
    }

    const response = json({
      ok: true,
      user: username,
    })

    response.cookies.set(
      'passport_session',
      'demo-session',
      {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 12,
        path: '/',
      },
    )

    return response
  }

  const denied = guard(request)

  if (denied) return denied

  try {
    const database = await db()
    const body = await request.json()

    if (path.endsWith('/api/customers')) {
      const count = await database
        .collection('customers')
        .countDocuments()

      const year = new Date().getFullYear()

      const fileNumber = `PS-${year}-${String(
        count + 1,
      ).padStart(4, '0')}`

      const totalAmount =
        Number(body.governmentFee || 0) +
        Number(body.serviceCharge || 0)

      const paidAmount = Number(body.paidAmount || 0)

      const customer = {
        ...body,
        fileNumber,
        totalAmount,
        paidAmount,
        balance: totalAmount - paidAmount,
        status: body.status || 'New',
        documents: body.documents || [],
        payments: body.payments || [],
        documents: body.documents || [],
        activity: [
          {
            type: 'Customer Added',
            text: 'New customer file created',
            at: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      }

      const result = await database
        .collection('customers')
        .insertOne(customer)

      return json(
        {
          ...safe(customer),
          _id: result.insertedId.toString(),
        },
        201,
      )
    }

    if (path.endsWith('/api/payments')) {
      const amount = Number(body.amount || 0)

      const customer = await database
        .collection('customers')
        .findOne({
          _id: require('mongodb').ObjectId.createFromHexString(
            body.customerId,
          ),
        })

      if (!customer) {
        return json(
          {
            error: 'Customer not found',
          },
          404,
        )
      }

      const payment = {
        amount,
        date: body.date || today,
        note: body.note || '',
        id: crypto.randomUUID(),
      }

      const paidAmount =
        Number(customer.paidAmount || 0) + amount

      const activity = [
        ...(customer.activity || []),
        {
          type: 'Payment Received',
          text: `₹${amount.toLocaleString(
            'en-IN',
          )} payment received`,
          at: new Date().toISOString(),
        },
      ]

      await database.collection('customers').updateOne(
        {
          _id: customer._id,
        },
        {
          $set: {
            paidAmount,
            balance: Math.max(
              0,
              Number(customer.totalAmount) - paidAmount,
            ),
            payments: [
              ...(customer.payments || []),
              payment,
            ],
            activity,
          },
        },
      )

      return json({ ok: true })
    }

    if (path.endsWith('/api/reminders')) {
      const customer = await database
        .collection('customers')
        .findOne({
          _id: require('mongodb').ObjectId.createFromHexString(
            body.customerId,
          ),
        })

      if (!customer) {
        return json(
          {
            error: 'Customer not found',
          },
          404,
        )
      }

      await database.collection('customers').updateOne(
        {
          _id: customer._id,
        },
        {
          $set: {
            reminderSent: true,
          },
        },
      )

      return json({ ok: true })
    }

    if (path.endsWith('/api/documents')) {
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return json(
          {
            error:
              'Cloudinary is not configured yet. Add its server-only environment values first.',
          },
          503,
        )
      }

      cloudinary.config({
        cloud_name:
          process.env.CLOUDINARY_CLOUD_NAME,
        api_key:
          process.env.CLOUDINARY_API_KEY,
        api_secret:
          process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })

      return json(
        {
          error:
            'Use the multipart upload endpoint.',
        },
        400,
      )
    }

    return json({ error: 'Not found' }, 404)
  } catch (error) {
    return json(
      {
        error: error.message || 'Server error',
      },
      500,
    )
  }
}

export async function PATCH(request) {
  const denied = guard(request)

  if (denied) return denied

  try {
    const body = await request.json()
    const database = await db()
    const { ObjectId } = require('mongodb')

    const id = ObjectId.createFromHexString(body.id)

    const customer = await database
      .collection('customers')
      .findOne({
        _id: id,
      })

    if (!customer) {
      return json(
        {
          error: 'Not found',
        },
        404,
      )
    }

    const activity = [
      ...(customer.activity || []),
      {
        type: 'Status Changed',
        text: `Status changed to ${body.status}`,
        at: new Date().toISOString(),
      },
    ]

    await database.collection('customers').updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: body.status,
          activity,
        },
      },
    )

    return json({ ok: true })
  } catch (error) {
    return json(
      {
        error: error.message,
      },
      400,
    )
  }
}

export async function DELETE(request) {
  const response = json({ ok: true })

  response.cookies.set(
    'passport_session',
    '',
    {
      maxAge: 0,
      path: '/',
    },
  )

  return response
}