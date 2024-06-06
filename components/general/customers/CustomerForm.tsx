'use client'

import { CreateEntityDialog } from '@/components/api/CreateEntity'
import { Button } from '@/components/ui/button'
import ComboBox from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Section from '@/components/ui/Section'
import CustomTitle from '@/components/utils/CustomTitle'
import { DocumentTypes, Genders } from '@/utilities/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  person: z.object({
    names: z.string().nonempty('Introduce un nombre válido.'),
    surnames: z.string().nonempty('Introduce un apellido válido.'),
    identificationType: z
      .string()
      .nonempty('Selecciona un tipo de identificación válido.'),
    identificationNumber: z
      .string()
      .min(6, 'El número de identificación debe tener al menos 6 caracteres.')
      .nonempty('Introduce un número de identificación válido.'),
    gender: z.string().nonempty('Selecciona un género válido.'),
    birthdate: z.string().nonempty('Introduce una fecha de nacimiento válida.'),
    email: z
      .string()
      .email('Introduce un correo electrónico válido.')
      .nonempty('Introduce un correo electrónico.'),
    mobilePhone: z
      .string()
      .min(10, 'El número de contacto debe tener 10 dígitos.')
      .max(10, 'El número de contacto debe tener 10 dígitos.')
      .nonempty('Introduce un número de contacto válido.')
  })
})

const CustomerForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      person: {
        names: '',
        surnames: '',
        identificationType: '',
        identificationNumber: '',
        gender: '',
        birthdate: '',
        email: '',
        mobilePhone: ''
      }
    }
  })

  const [formData, setFormData] = useState<z.infer<typeof FormSchema> | null>(
    null
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const now = new Date().toISOString()
    const formDataWithTimestamps = {
      ...data,
      createdAt: now,
      person: {
        ...data.person,
        createdAt: now
      }
    }
    setFormData(formDataWithTimestamps)
    setDialogOpen(true)
  }

  const handleOnComplete = () => {
    console.log('Entidad creada con éxito')
    setDialogOpen(false)
    setFormData(null)
  }

  const handleError = (error: string) => {
    console.error(error)
  }

  return (
    <Section>
      <CustomTitle title={'Registrar cliente'} />
      <form
        className='flex flex-wrap justify-between'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='w-full md:w-1/2 lg:w-1/2 px-2'>
          <div className='mb-4'>
            <Label htmlFor='names'>Nombres</Label>
            <Input
              id='names'
              placeholder='Ej. Juan'
              type='text'
              {...register('person.names')}
            />
            {errors.person?.names && (
              <span className='text-red-600 text-sm font-semibold'>
                {errors.person.names.message}
              </span>
            )}
          </div>
          <div className='mb-4'>
            <Label htmlFor='surnames'>Apellidos</Label>
            <Input
              id='surnames'
              placeholder='Ej. Pineda'
              type='text'
              {...register('person.surnames')}
            />
            {errors.person?.surnames && (
              <span className='text-red-600 text-sm font-semibold'>
                {errors.person.surnames.message}
              </span>
            )}
          </div>
          <div className='mb-4'>
            <ComboBox
              id='identificationType'
              label='Tipo de identificación'
              options={DocumentTypes}
              register={register('person.identificationType')}
              error={errors.person?.identificationType?.message}
            />
          </div>
          <div className='mb-4'>
            <Label htmlFor='identificationNumber'>
              Número de identificación
            </Label>
            <Input
              id='identificationNumber'
              placeholder='Ej. 123456789'
              type='text'
              {...register('person.identificationNumber')}
            />
            {errors.person?.identificationNumber && (
              <span className='text-red-600 text-sm font-semibold'>
                {errors.person.identificationNumber.message}
              </span>
            )}
          </div>
        </div>
        <div className='w-full md:w-1/2 lg:w-1/2 px-2'>
          <div className='mb-4'>
            <Label htmlFor='birthdate'>Fecha de nacimiento</Label>
            <Input
              id='birthdate'
              type='date'
              {...register('person.birthdate')}
            />
            {errors.person?.birthdate && (
              <span className='text-red-600 text-sm font-semibold'>
                {errors.person.birthdate.message}
              </span>
            )}
          </div>
          <div className='mb-4'>
            <Label htmlFor='email'>Correo electrónico</Label>
            <Input
              id='email'
              type='email'
              placeholder='Ej. example@example.com'
              {...register('person.email')}
            />
            {errors.person?.email && (
              <span className='text-red-600 text-sm font-semibold'>
                {errors.person.email.message}
              </span>
            )}
          </div>
          <div className='mb-4'>
            <Label htmlFor='mobilePhone'>Número de contacto</Label>
            <Input
              id='mobilePhone'
              type='number'
              maxLength={10}
              minLength={10}
              placeholder='Ej. 3003032011'
              {...register('person.mobilePhone')}
            />
            {errors.person?.mobilePhone && (
              <span className='text-red-600 text-sm font-semibold'>
                {errors.person.mobilePhone.message}
              </span>
            )}
          </div>
          <div className='mb-4'>
            <ComboBox
              id='gender'
              label='Género'
              options={Genders}
              register={register('person.gender')}
              error={errors.person?.gender?.message}
            />
          </div>
        </div>
        <div className='w-full px-2'>
          <CreateEntityDialog
            entity='customer'
            entityName={`el cliente ${formData?.person.names} ${formData?.person.surnames}`}
            entityAttributes={formData ?? {}}
            onComplete={handleOnComplete}
            onError={handleError}
            buttonComponent={
              <Button variant='travely' type='submit' disabled={!isValid}>
                Crear
              </Button>
            }
          />
        </div>
      </form>
    </Section>
  )
}

export default CustomerForm
