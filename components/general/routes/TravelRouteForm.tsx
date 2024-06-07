'use client'

import { CreateEntityDialog } from '@/components/api/CreateEntity'
import { Button } from '@/components/ui/button'
import ComboBox from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Section from '@/components/ui/Section'
import CustomTitle from '@/components/utils/CustomTitle'
import useFetch from '@/hooks/useFetch'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  depaOrigenId: z.string().nonempty('Seleccione un departamento.'),
  departureCityId: z.string().nonempty('Seleccione una ciudad.'),
  depaDestinoId: z.string().nonempty('Seleccione un departamento.'),
  destinationCityId: z.string().nonempty('Seleccione una ciudad.'),
  durationHours: z.string().nonempty('Ingrese la duracion (numero)'),
  distanceKilometers: z.string().nonempty('Ingrese la distancia (numero)'),
  createdAt: z.date()
})

type FormData = z.infer<typeof FormSchema>

interface Departamentos {
  id: string
  name: string
}

interface Municipio extends Departamentos {}

const TravelRouteForm = () => {
  const [formData, setFormData] = useState<Omit<
    FormData,
    'depaOrigenId' | 'depaDestinoId'
  > | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      depaOrigenId: '',
      departureCityId: '',
      depaDestinoId: '',
      destinationCityId: '',
      durationHours: '',
      distanceKilometers: '',
      createdAt: new Date()
    }
  })

  const onSubmit = (data: FormData) => {
    const { depaOrigenId, depaDestinoId, ...rest } = data
    setFormData(rest)
    setDialogOpen(true)
  }

  const handleError = (error: string) => console.log('Ocurrio un error')

  const [selectedCityOri, setSelectedCityOri] = useState<string>('0')
  const [selectedCityDesti, setSelectedCityDesti] = useState<string>('0')

  const watchDepaOrigenId = watch('depaOrigenId')
  const watchDepaDestinoId = watch('depaDestinoId')

  useEffect(() => {
    setSelectedCityOri(watchDepaOrigenId)
    setSelectedCityDesti(watchDepaDestinoId)
  }, [watchDepaOrigenId, watchDepaDestinoId])

  const { data: dataCityOri } = useFetch<Municipio>(
    `/city/get-cities-by-deparment-id/${selectedCityOri}`
  )
  const { data: dataCityDesti } = useFetch<Municipio>(
    `/city/get-cities-by-deparment-id/${selectedCityDesti}`
  )

  const opcionMuniOrigen = dataCityOri.map(municipios => ({
    value: municipios.id,
    label: municipios.name
  }))

  const opcionMuniDestino = dataCityDesti.map(municipios => ({
    value: municipios.id,
    label: municipios.name
  }))

  const {
    data: dataDepart,
    hasError,
    isLoading
  } = useFetch<Departamentos>('/deparment/get-all')

  const opcionDepaOrigen = dataDepart.map(departamentos => ({
    value: departamentos.id,
    label: departamentos.name
  }))

  const opcionDepaDestino = dataDepart.map(departamentos => ({
    value: departamentos.id,
    label: departamentos.name
  }))

  const handleOnComplete = () => {
    console.log('Entidad creada con éxito')
    setDialogOpen(false)
    setFormData(null)
  }

  return (
    <Section>
      <CustomTitle title={'Registrar ruta de viaje'} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid  grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-2'>
          <div>
            <ComboBox
              label='Departamento Origen'
              id='a'
              options={opcionDepaOrigen}
              register={register('depaOrigenId')}
            />
            {errors.depaOrigenId && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.depaOrigenId?.message}
              </span>
            )}
          </div>
          <div>
            <ComboBox
              label='Ciudad Origen'
              id='a'
              options={opcionMuniOrigen}
              disabled={!watch('depaOrigenId')}
              register={register('departureCityId')}
            />
            {errors.departureCityId && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.departureCityId?.message}
              </span>
            )}
          </div>
          <div>
            <ComboBox
              label='Departamento Destino'
              id='destinationCityId'
              options={opcionDepaDestino}
              register={register('depaDestinoId')}
            />
            {errors.depaDestinoId && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.depaDestinoId?.message}
              </span>
            )}
          </div>
          <div>
            <ComboBox
              label='Ciudad destino'
              id='destinationCityId'
              options={opcionMuniDestino}
              disabled={!watch('depaDestinoId')}
              register={register('destinationCityId')}
            />
            {errors.destinationCityId && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.destinationCityId?.message}
              </span>
            )}
          </div>
          <div>
            <Label>{'Duracion del viaje(Horas)'}</Label>
            <Input
              id='durationHours'
              type='number'
              placeholder='Duracion de viaje'
              {...register('durationHours')}
            />
            {errors.durationHours && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.durationHours.message}
              </span>
            )}
          </div>
          <div>
            <Label>{'Distancia(Km)'}</Label>
            <Input
              id='distanceKilometers'
              type='number'
              placeholder='Distancia'
              {...register('distanceKilometers')}
            />
            {errors.distanceKilometers && (
              <span className='text-red-600 text-sm font-sans'>
                {errors.distanceKilometers.message}
              </span>
            )}
          </div>
        </div>
        <div className='mt-4'>
          <CreateEntityDialog
            entity='travel-route'
            entityName={`${formData?.departureCityId} - ${formData?.destinationCityId}`}
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

export default TravelRouteForm
