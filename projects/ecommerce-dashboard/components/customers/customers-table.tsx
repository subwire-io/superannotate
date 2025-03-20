'use client'

import { Customer } from '@/types'
import { DataTable } from '@/components/ui/data-table'
import { customersColumns } from '@/components/customers/customers-table-columns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customers</CardDescription>
        </div>
        <Button className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Customer
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={customersColumns} 
          data={customers} 
          filterPlaceholder="Search customers..."
          filterColumn="name"
        />
      </CardContent>
    </Card>
  )
}
