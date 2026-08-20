import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any, // fallback pour les types de la dernière version
})

export async function createCheckoutSession(priceId: string, email?: string, userId?: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    customer_email: email,
    client_reference_id: userId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tarifs`,
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  })

  return session
}
