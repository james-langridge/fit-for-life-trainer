'use client'

import React, {useEffect, useState} from 'react'
import {
  createSession,
  deleteSession,
  fetchSession,
  updateSession,
} from '@/lib/api'
import Info from '@/components/Info'
import {useRouter} from 'next/navigation'

export default function CalendarForm({
  sessionId,
  userId = '',
}: {
  sessionId?: string
  userId?: string
}) {
  const initialState: {
    error: null | Error
    form: {
      date: string
      description?: string
      name: string
      ownerId: string
      sessionId: string
      videoUrl?: string
    }
    status: 'idle' | 'pending' | 'rejected' | 'resolved'
  } = {
    error: null,
    form: {
      date: '',
      description: '',
      name: '',
      ownerId: userId,
      sessionId: '',
      videoUrl: '',
    },
    status: 'idle',
  }
  const [state, setState] = useState({...initialState})
  const {status, form, error} = state
  const [mode, setMode] = useState<
    'updateSession' | 'createSession' | 'deleteSession'
  >('createSession')
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      if (sessionId) {
        const session = await fetchSession(sessionId)
        const date = new Date(session.date)
        const isoString = date.toISOString()
        const dateString = isoString.substring(0, 10)

        setState({
          ...state,
          form: {
            ...state.form,
            date: dateString,
            description: session.description ?? undefined,
            name: session.name,
            sessionId: sessionId,
            videoUrl: session.videoUrl ?? undefined,
          },
        })
      }
    }

    void getSession()
  }, [sessionId])

  useEffect(() => {
    setState({
      ...state,
      form: {...state.form, ownerId: userId},
    })
  }, [userId])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setState({...state, status: 'pending'})

    try {
      if (state.form.sessionId) {
        setMode('updateSession')
        await updateSession(form)
      } else {
        setMode('createSession')
        await createSession(form)
      }

      setState({
        ...initialState,
        status: 'resolved',
      })

      router.refresh()
    } catch (error) {
      setState({
        ...initialState,
        status: 'rejected',
        error: error as Error,
      })
    }
  }

  async function handleDelete() {
    setMode('deleteSession')
    setState({...state, status: 'pending'})

    try {
      if (!sessionId) {
        return
      }

      await deleteSession({...form, delete: 'true'})

      setState({
        ...initialState,
        status: 'resolved',
      })

      router.refresh()
    } catch (error) {
      setState({
        ...initialState,
        status: 'rejected',
        error: error as Error,
      })
    }
  }

  function resetForm() {
    setState({...initialState})
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="hidden" value={sessionId} />
        <input required type="hidden" value={userId} />
        <input
          required
          onChange={e =>
            setState(state => ({
              ...state,
              form: {...state.form, date: e.target.value},
            }))
          }
          placeholder="Date"
          type="date"
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={form.date}
        />
        <input
          required
          onChange={e =>
            setState(state => ({
              ...state,
              form: {...state.form, name: e.target.value},
            }))
          }
          placeholder="Session name"
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={form.name}
        />
        <textarea
          onChange={e =>
            setState(state => ({
              ...state,
              form: {...state.form, description: e.target.value},
            }))
          }
          placeholder="Description"
          rows={5}
          cols={15}
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={form.description}
        />
        <input
          onChange={e =>
            setState(state => ({
              ...state,
              form: {...state.form, videoUrl: e.target.value},
            }))
          }
          placeholder="Video url"
          type="url"
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={form.videoUrl}
        />
        <Info status={status} error={error} mode={mode} />
        <button
          disabled={!userId}
          type="submit"
          className="mt-4 w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 enabled:hover:bg-blue-400"
        >
          {state.form.sessionId ? 'Update' : 'Create'}
        </button>
        {state.form.sessionId && (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-4 w-full transform rounded-lg bg-red-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={resetForm}
          className="mt-4 w-full transform rounded-lg bg-yellow-500 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-50"
        >
          Reset form
        </button>
      </form>
    </>
  )
}
