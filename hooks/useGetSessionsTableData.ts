'use client'

import {useCallback, useEffect, useState} from 'react'
import {SerialisedUser} from '@/lib/users'
import {
  SerialisedSession,
  SerialisedSessionKey,
  sortSessions,
} from '@/lib/sessions'
import {getUserWithSessions} from '@/lib/api'

export function useGetSessionsTableData(slug: string) {
  const [sortCol, setSortCol] = useState<SerialisedSessionKey>('date')
  const [sessions, setSessions] = useState<SerialisedSession[] | undefined>()
  const [user, setUser] = useState<SerialisedUser>()

  const getUserSessions = useCallback(async () => {
    const fetchedUser = await getUserWithSessions(slug)
    const sortedSessions = sortSessions(sortCol, fetchedUser.sessions)

    setUser(fetchedUser)
    setSessions(sortedSessions)
  }, [slug, sortCol])

  useEffect(() => {
    void getUserSessions()
  }, [])

  useEffect(() => {
    if (!sessions) {
      return
    }

    const sortedSessions = sortSessions(sortCol, [...sessions])

    setSessions(sortedSessions)
  }, [sortCol])

  return {sessions, user, setSortCol}
}
