'use client'

import { MainNav } from '@/components/layout/main-nav'
import { ScrollArea } from '@/components/ui/scroll-area'

export function SidebarNav() {
  return (
    <div className="hidden border-r bg-background md:block">
      <ScrollArea className="h-[calc(100vh-64px)] px-4 py-6">
        <MainNav />
      </ScrollArea>
    </div>
  )
}
