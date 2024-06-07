import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CustomTitle from '@/components/utils/CustomTitle'
import React, { useEffect, useState } from 'react'
import { MdModeEdit } from 'react-icons/md'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { DialogFooter } from '@/components/ui/dialog'
import ComboboxFetch from '@/components/api/ComboboxFetch'
import ComboBox from '@/components/ui/combobox'
import { FuelTypes, ModelTypes, TransmissionTypes } from '@/utilities/types'

interface FormValues {
  name: string
  category: string
  fueltype: string
  transmissionType: string
  seatingCapacity: number
  carBrandId: number
}

interface CarData {
  name: string
  category: string
  fueltype: string
  transmissionType: string
  seatingCapacity: number
  carBrandId: number
}

const initialState: FormValues = {
  name: '',
  category: '',
  fueltype: '',
  transmissionType: '',
  seatingCapacity: 0,
  carBrandId: 0
}

const ModelUpdate: React.FC<{
  id: number
  entity: string
  entityName: string
  onComplete: () => void
}> = ({ id, entity, entityName, onComplete }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormValues>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get('authTokens') || '')
        const cookieData = JSON.parse(cookieValue)
        const token = cookieData?.data?.token

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/car/get-by-id/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              accept: 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Error al obtener los datos del auto.')
        }

        const data: CarData = await response.json()

        // Llenar los campos del formulario con los datos recibidos
        setValue('name', data.name)
        setValue('category', data.category)
        setValue('fueltype', data.fueltype)
        setValue('transmissionType', data.transmissionType)
        setValue('seatingCapacity', data.seatingCapacity)
        setValue('carBrandId', data.carBrandId)
      } catch (error) {
        // Manejar el error
        setIsError(true)
        setError('Error al obtener los datos del auto.')
      }
    }

    fetchData()
  }, [id, setValue])
  const handleUpdate = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const cookieValue = decodeURIComponent(Cookies.get('authTokens') || '')
      const cookieData = JSON.parse(cookieValue)
      const token = cookieData?.data?.token

      if (!token) {
        throw new Error('No se encontró el token en el cookie.')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          },
          body: JSON.stringify({ id, ...data })
        }
      )

      const responseData = await response.json()

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.data || `Error al actualizar ${entityName}.`
        )
      }

      onComplete()
      handleClose()
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Error al actualizar ${entityName}.`
      setError(errorMessage)
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsError(false)
    setError(null)
    setIsOpen(false)
    reset(initialState)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'update'} className='w-9 h-9' size={'icon'}>
          <MdModeEdit className='text-xl' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <CustomTitle title={`Actualizar modelo ${entityName}`} />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se actualizará el registro en el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4'>
            <div className='w-full lg:w-1/2'>
              <Label htmlFor='name'>Nombre del modelo</Label>
              <Input
                id='name'
                placeholder='Ej. Paradisso'
                type='text'
                {...register('name')}
                className='w-full'
              />
              {errors.name && (
                <span className='text-red-600 text-sm font-semibold'>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className='w-full lg:w-1/2'>
              <ComboBox
                id='category'
                label='Categoría'
                options={ModelTypes}
                register={register('category')}
                error={errors.category?.message}
              />
            </div>
          </div>
          <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4'>
            <div className='w-full lg:w-1/2'>
              <ComboBox
                id='fueltype'
                label='Tipo de gasolina'
                options={FuelTypes}
                register={register('fueltype')}
                error={errors.fueltype?.message}
              />
            </div>
            <div className='w-full lg:w-1/2'>
              <ComboBox
                id='transmissionType'
                label='Tipo de transmisión'
                options={TransmissionTypes}
                register={register('transmissionType')}
                error={errors.transmissionType?.message}
              />
            </div>
          </div>
          <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4'>
            <div className='w-full lg:w-1/2'>
              <Label htmlFor='seatingCapacity'>Capacidad de asientos</Label>
              <Input
                id='seatingCapacity'
                placeholder='min. 10'
                type='number'
                {...register('seatingCapacity')}
                className='w-full'
              />
              {errors.seatingCapacity && (
                <span className='text-red-600 text-sm font-semibold'>
                  {errors.seatingCapacity.message}
                </span>
              )}
            </div>
            <div className='w-full lg:w-1/2'>
              <ComboboxFetch
                id='carBrandId'
                endpoint='car-brand/get-all'
                label='Marca'
                register={register('carBrandId')}
                error={errors.carBrandId?.message}
              />
            </div>
          </div>
          {isError && error && (
            <div className='text-red-600'>
              {error.split(',').map((errorMessage, index) => (
                <div key={index}>- {errorMessage}</div>
              ))}
            </div>
          )}
          <div className='flex justify-end'>
            <DialogFooter className='flex-shrink-0'>
              <AlertDialogCancel onClick={handleClose}>
                Cancelar
              </AlertDialogCancel>
            </DialogFooter>
            <div className='ml-4'>
              <Button variant={'update'} onClick={handleSubmit(handleUpdate)}>
                Actualizar
              </Button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ModelUpdate
