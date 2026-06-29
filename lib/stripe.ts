import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-06-24.dahlia',
})

export async function createCheckoutSession(params: {
  serviceId: string
  serviceName: string
  price: number
  userId: string
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: params.serviceName,
            description: `Purchase of ${params.serviceName}`,
          },
          unit_amount: Math.round(params.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      serviceId: params.serviceId,
      userId: params.userId,
    },
  })

  return session
}

export async function getSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId)
}
