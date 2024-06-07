'use client'
import { ReactNode } from 'react'
import Header from '@/components/utils/Header'
import HeaderMobile from '@/components/utils/HeaderMobile'
import MarginWidthWrapper from '@/components/utils/MarginWifthWrapper'
import PageWrapper from '@/components/utils/PageWrapper'
import SideNav from '@/components/utils/Sidenav'

type LayoutProps = Readonly<{
  children: ReactNode
}>

function Layout ({ children }: LayoutProps) {
  return (
    <main>
      <div className='flex'>
        <SideNav />
        <div className='flex-1'>
          <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
          </MarginWidthWrapper>
        </div>
      </div>
    </main>
  )
}

export default Layout
