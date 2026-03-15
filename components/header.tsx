'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-purple-400">
          AI Factory
        </Link>
        
        {session?.user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              {session.user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Выйти
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
