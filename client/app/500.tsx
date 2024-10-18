import React from 'react'
import Link from 'next/link'

export default function InternalServerError() {
  return (
    <div>
      <h2>500 - Internal Server Error</h2>
      <p>Oops! Something went wrong on our end.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}

