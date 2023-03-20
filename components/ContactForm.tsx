'use client'

import React, {useState} from 'react'
import {submitContactForm} from '@/lib/api'

const initialState = {name: '', email: '', message: ''}

export default function ContactForm() {
  const [state, setState] = useState(initialState)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    // Previously, API Routes could have been used for use cases like
    // handling form submissions. Route Handlers are likely not the solution
    // for these uses cases. We will be recommending the use of mutations for
    // this when ready.
    // https://beta.nextjs.org/docs/routing/route-handlers#dynamic-route-handlers
    // https://beta.nextjs.org/docs/data-fetching/mutating
    await submitContactForm(state).then(
      () => setState(initialState),
      error => console.error(error),
    )
  }

  return (
    <form className="mt-12" onSubmit={handleSubmit}>
      <div className="-mx-2 md:flex md:items-center">
        <div className="flex-1 px-2">
          <label className="mb-2 block text-sm text-gray-600 dark:text-gray-200">
            Full Name
            <input
              onChange={e => setState({...state, name: e.target.value})}
              required
              value={state.name}
              type="text"
              placeholder="John Doe"
              className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
            />
          </label>
        </div>

        <div className="mt-4 flex-1 px-2 md:mt-0">
          <label className="mb-2 block text-sm text-gray-600 dark:text-gray-200">
            Email address
            <input
              onChange={e => setState({...state, email: e.target.value})}
              type="email"
              placeholder="johndoe@example.com"
              required
              value={state.email}
              className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 w-full">
        <label className="mb-2 block text-sm text-gray-600 dark:text-gray-200">
          Message
          <textarea
            required
            value={state.message}
            onChange={e => setState({...state, message: e.target.value})}
            className="mt-2 block h-32 w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400 md:h-56"
            placeholder="Message"
          ></textarea>
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 w-full transform rounded-md bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
      >
        get in touch
      </button>
    </form>
  )
}
