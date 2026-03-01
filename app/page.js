import Products from '@/pages/Product'
import React from 'react'

export const dynamic = "force-dynamic"

const page = () => {
  // const randomNumber = Math.random();
  // console.log({ randomNumber })
  // if (randomNumber > 0.5) {
  //   throw new Error("something went wrong")
  // }
  return (
    <Products />
  )
}

export default page
