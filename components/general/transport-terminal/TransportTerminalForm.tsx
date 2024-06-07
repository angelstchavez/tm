'use client'

import ComboBox from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Section from '@/components/ui/Section'
import CustomTitle from '@/components/utils/CustomTitle'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useFetch from '@/hooks/useFetch'
import { CreateEntityDialog } from '@/components/api/CreateEntity'
import { Button } from '@/components/ui/button'

type FormData = z.infer<typeof FormSchema>

const FormSchema = z.object({
  name: z.string().nonempty('Introduce un nombre valido.'),
  address: z.string().nonempty('Introduce una direccion.'),
  phoneNumber: z
    .string()
    .max(10, 'El numero de telefono no puede ser mayor a 10 digitos')
    .nonempty('Introduce numero de telefono.'),
  departamentoId: z.string().nonempty('Selecciona un departamento.'),
  cityId: z.string().nonempty('Selecciona un municipio.'),
  isActive: z.boolean(),
  createdAt: z.date() // Agregamos el campo createdAt
})

interface Departamentos {
  id: string
  name: string
}

interface Municipio extends Departamentos {}

const TransportTerminalForm = () => {
  const [formData, setFormData] = useState<Omit<
    FormData,
    'departamentoId'
  > | null>(null)

  const [selectedCity, setSelectedCity] = useState<string>('0')

  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      address: '',
      phoneNumber: '',
      departamentoId: '',
      cityId: '',
      isActive: true,
      createdAt: new Date()
    }
  })

  const onSubmit = (data: FormData) => {
    const { departamentoId, ...rest } = data
    setFormData(rest)
    setDialogOpen(true)
  }

  const handleError = (error: string) => console.log('Ocurrio un error')
  const {
    data: dataDepart,
    hasError,
    isLoading
  } = useFetch<Departamentos>('/deparment/get-all')

  const opcionDepartamento = dataDepart.map(departamentos => ({
    value: departamentos.id,
    label: departamentos.name
  }))

  const watchDepartamentoId = watch('departamentoId')

  useEffect(() => {
    setSelectedCity(watchDepartamentoId)
  }, [watchDepartamentoId])

  const {
    data: dataCity,
    hasError: hasErroCity,
    isLoading: isLoadingCity
  } = useFetch<Municipio>(`/city/get-cities-by-deparment-id/${selectedCity}`)

  const opcionMunicipios = dataCity.map(municipios => ({
    value: municipios.id,
    label: municipios.name
  }))

  const handleOnComplete = () => {
    console.log('Entidad creada con éxito')
    setDialogOpen(false)
    setFormData(null)
  }

  return (
    <Section>
      <CustomTitle title={'Registrar terminal de transporte'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid  grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-2'>
          <div>
            <Label>Nombre</Label>
            <Input id='name' placeholder='Nombre' {...register('name')} />
            {errors.name && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.name.message}
              </span>
            )}
          </div>

          <div className='lg:col-span-2'>
            <Label>Direccion</Label>
            <Input
              id='address'
              placeholder='Direccion'
              {...register('address')}
            />
            {errors.address && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.address.message}
              </span>
            )}
          </div>

          <div>
            <ComboBox
              label='Departamento'
              id='departamentoId'
              options={opcionDepartamento}
              register={register('departamentoId')}
            />
            <span className='text-red-600 text-sm font-sans'>
              {errors.departamentoId?.message}
            </span>
          </div>

          <div>
            <ComboBox
              label='Ciudad'
              id='cityId'
              options={opcionMunicipios}
              register={register('cityId')}
              disabled={!watch('departamentoId')}
            />
            <span className='text-red-600 text-sm font-sans'>
              {errors.cityId?.message}
            </span>
          </div>

          <div>
            <Label>Numero de telefono</Label>
            <Input
              id='phoneNumber'
              placeholder='Telefono'
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.phoneNumber.message}
              </span>
            )}
          </div>
        </div>
        <div className='mt-4'>
          <CreateEntityDialog
            entity='transport-terminal'
            entityName={formData?.name ?? ''}
            entityAttributes={formData ?? {}}
            onComplete={handleOnComplete}
            onError={handleError}
            buttonComponent={
              <Button variant={'travely'} disabled={!isValid} type='submit'>
                Crear
              </Button>
            }
          />
        </div>
      </form>
    </Section>
  )
}

export default TransportTerminalForm
