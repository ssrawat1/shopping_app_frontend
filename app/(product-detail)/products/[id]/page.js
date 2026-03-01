import ProductDetails from '@/pages/ProductDetails';
import { notFound } from 'next/navigation';
import React from 'react'

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `product-${id}`
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  const regex = /^[a-f0-9]{24}$/
  if (!regex.test(id)) {
    notFound()
  }

  return (
    <ProductDetails productId={id} />
  )
}
