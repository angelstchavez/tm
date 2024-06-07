'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { FaUser } from 'react-icons/fa'
import CustomAlertDialog from '@/components/utils/CustomAlertDialog'
import Section from '@/components/ui/Section'
import CustomTitle from '@/components/utils/CustomTitle'

const FormSchema = z
  .object({
    oldPassword: z
      .string()
      .nonempty('Introduce una contraseña anterior válida.'),
    newPassword: z.string().min(6, 'Debe contener 6 caracteres como mínimo.'),
    confirmPassword: z
      .string()
      .min(6, 'Debe contener 6 caracteres como mínimo.')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las nuevas contraseñas no coinciden.',
    path: ['confirmPassword']
  })

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [errorDescription, setErrorDescription] = useState<string>('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    if (form.formState.isValid) {
      setErrorDescription('')
    }
  }, [form.formState.isValid])

  const changePasswordSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
          })
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(
          responseData.message || 'Error al cambiar la contraseña.'
        )
      }

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido actualizada correctamente.'
      })
      router.push('/profile')
    } catch (error: any) {
      setErrorDescription(error.message || 'Error al cambiar la contraseña.')
    }
  }

  const clearErrorDescription = () => {
    setErrorDescription('')
  }

  const isFormValid = form.formState.isValid

  const { userData } = useAuthContext();

  return (
    <>
      <Section>
        <CustomTitle title={'Mi Perfil'}></CustomTitle>
        <h1 className='font-bold text-xl mb-4'>
          Rol: <span className='font-normal'>{userData.role}</span>
        </h1>
        <div className='flex flex-col mb-4'>
          <div className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center'>
            <FaUser className='text-4xl text-gray-600' />
          </div>
          <p className='mt-4 text-lg font-semibold'>{userData.username}</p>
          <p className='text-gray-600'>{userData.email}</p>
        </div>
      </Section>
      <Section>
        <CustomTitle title={'Actualizar contraseña'}></CustomTitle>
        <form
          onSubmit={form.handleSubmit(changePasswordSubmit)}
          className='flex flex-col items-center w-full max-w-sm gap-3'
        >
          <div className='w-full'>
            <Label htmlFor='oldPassword'>Contraseña anterior</Label>
            <Input
              type='password'
              id='oldPassword'
              placeholder='••••••••••'
              {...form.register('oldPassword')}
              onInput={clearErrorDescription}
            />
            {form.formState.errors.oldPassword && (
              <span className='text-red-600 text-sm font-semibold'>
                {form.formState.errors.oldPassword.message}
              </span>
            )}
          </div>
          <div className='w-full'>
            <Label htmlFor='newPassword'>Nueva contraseña</Label>
            <Input
              type='password'
              id='newPassword'
              placeholder='••••••••••'
              {...form.register('newPassword')}
              onInput={clearErrorDescription}
            />
            {form.formState.errors.newPassword && (
              <span className='text-red-600 text-sm font-semibold'>
                {form.formState.errors.newPassword.message}
              </span>
            )}
          </div>
          <div className='w-full'>
            <Label htmlFor='confirmPassword'>Confirmar nueva contraseña</Label>
            <Input
              type='password'
              id='confirmPassword'
              placeholder='••••••••••'
              {...form.register('confirmPassword')}
              onInput={clearErrorDescription}
            />
            {form.formState.errors.confirmPassword && (
              <span className='text-red-600 text-sm font-semibold'>
                {form.formState.errors.confirmPassword.message}
              </span>
            )}
          </div>
          {errorDescription && (
            <span className='text-red-600 text-sm font-semibold'>
              {errorDescription}
            </span>
          )}
          <CustomAlertDialog
            triggerButton={
              <Button variant={'travely'} className='w-full mt-3' type='submit'>
                Actualizar contraseña
              </Button>
            }
            type='update'
            title='Deseas actualizar la contraseña?'
            description='Este cambio no se podrá revertir, a menos que desees cambiar la contraseña nuevamente.'
            isValid={isFormValid}
            onConfirm={() => changePasswordSubmit(form.getValues())}
          />
        </form>
      </Section>
    </>
  )
}

export default ProfilePage
