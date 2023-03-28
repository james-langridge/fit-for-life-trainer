import React, {Fragment, useEffect, useState} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import {fetchUsers} from '@/lib/api'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export interface User {
  firstName: string
  lastName: string
  id: string
}

export default function CalendarDropdown({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}) {
  const [users, setUsers] = useState<User[]>()

  const getUsers = async () => {
    const users = await fetchUsers()

    setUsers(users)
  }

  useEffect(() => {
    void getUsers()
  }, [])

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Clients
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="w-50 absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {users &&
              users.map(user => {
                return (
                  <Menu.Item key={user.lastName}>
                    {({active}) => (
                      <button
                        onClick={() => setUser(user)}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block w-44 px-4 py-2 text-sm',
                        )}
                      >
                        {user.firstName} {user.lastName}
                      </button>
                    )}
                  </Menu.Item>
                )
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
