'use client'

import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import Loading from '@/components/utils/Loading'
import { FaEdit } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import Section from '@/components/ui/Section'
import { DeleteEntityDialog } from '@/components/api/DeleteEntity'
import CustomTitle from '@/components/utils/CustomTitle'
import ExportCsvButton from '@/components/utils/ExportCsvButton'
import GeneralReport from '@/components/utils/GeneralReport'
import { getToken } from '@/lib/GetToken'

interface Person {
  id: number
  names: string
  surnames: string
  identificationNumber: string
  identificationType: string
  gender: string
  birthdate: string
  email: string
  mobilePhone: string
  createdAt: string
}

interface Customer {
  id: number
  person: Person
  createdAt: string
}

const NoDataComponent = () => (
  <p className='text-red-600 font-bold'>
    No se encuentran resultados de tu búsqueda
  </p>
)

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [originalCustomers, setOriginalCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [searchName, setSearchName] = useState<string>('')
  const [searchDocument, setSearchDocument] = useState<string>('')
  const [reloadData, setReloadData] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/get-all`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${getToken()}`,
              Accept: 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Error al obtener los clientes.')
        }

        const responseData = await response.json()

        if (!responseData.success || !responseData.data) {
          throw new Error('La respuesta no contiene datos válidos.')
        }

        const fetchedCustomers = responseData.data
        setCustomers(fetchedCustomers)
        setOriginalCustomers(fetchedCustomers)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [reloadData])

  useEffect(() => {
    let filteredCustomers = originalCustomers

    if (searchName) {
      filteredCustomers = filteredCustomers.filter(customer =>
        `${customer.person.names} ${customer.person.surnames}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      )
    }

    if (searchDocument) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.person.identificationNumber.includes(searchDocument)
      )
    }

    setCustomers(filteredCustomers)
  }, [searchName, searchDocument, originalCustomers])

  const handleCustomerDelete = () => {
    setReloadData(prevReloadData => !prevReloadData)
  }

  const columns: TableColumn<Customer>[] = [
    {
      name: 'Nombre Completo',
      selector: row => `${row.person.names} ${row.person.surnames}`,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    {
      name: 'Número de Identificación',
      selector: row => row.person.identificationNumber,
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Tipo de Identificación',
      selector: row => row.person.identificationType,
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Género',
      selector: row => row.person.gender,
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Fecha de Nacimiento',
      selector: row => {
        const date = new Date(row.person.birthdate)
        return date.toLocaleDateString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      },
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Email',
      selector: row => row.person.email,
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Teléfono Móvil',
      selector: row => row.person.mobilePhone,
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Fecha de Registro',
      selector: row => {
        const date = new Date(row.createdAt)
        return date.toLocaleDateString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      },
      sortable: true,
      style: {
        fontSize: 14
      }
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className='flex space-x-2'>
          <button className='bg-orange-600 rounded text-white p-1'>
            <FaEdit className='text-xl' />
          </button>
          <DeleteEntityDialog
            entityId={row.id}
            entity='customer'
            entityCamelCase='customer'
            entityName={`${row.person.names} ${row.person.surnames}`}
            onComplete={handleCustomerDelete}
          />
        </div>
      )
    }
  ]

  return (
    <Section>
      <div className='flex items-center justify-between'>
        <CustomTitle title={'Clientes'} />
        <div className='flex space-x-4'>
          <div className='w-1/2 max-w-md py-2'>
            <Input
              type='text'
              placeholder='Buscar por nombre completo'
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </div>
          <div className='w-1/2 max-w-md py-2'>
            <Input
              type='text'
              placeholder='Buscar por número de documento'
              value={searchDocument}
              onChange={e => setSearchDocument(e.target.value)}
            />
          </div>
        </div>
      </div>
      {error && <div className='text-red-600 mb-4'>Error: {error}</div>}
      <div className='grid grid-col-1'>
        <DataTable
          columns={columns}
          data={customers}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className='flex items-center justify-end'>
          <div className='mr-2'>
            <ExportCsvButton
              data={customers.map(customer => ({
                'Nombre Completo': `${customer.person.names} ${customer.person.surnames}`,
                'Número de Identificación':
                  customer.person.identificationNumber,
                'Tipo de Identificación': customer.person.identificationType,
                Género: customer.person.gender,
                'Fecha de Nacimiento': new Date(
                  customer.person.birthdate
                ).toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }),
                Email: customer.person.email,
                'Teléfono Móvil': customer.person.mobilePhone,
                'Fecha de Registro': new Date(
                  customer.createdAt
                ).toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              }))}
              fileName='clientes.csv'
            />
          </div>
          <div>
            <GeneralReport entity={'customer'}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default CustomerTable
