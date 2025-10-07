import { useContext, useEffect } from "react"

import Header from '../components/Main/header'
import Aside from '../components/Main/aside'
import Footer from '../components/Main/footer'
import Container from '../components/Container'
import { AuthContext } from '../contexts/context'
import { MainProvider } from '../contexts/main'

const ContainerMain = ({ children }) => {
  const { user } = useContext(AuthContext)

  const wrapperClass = 'wrapper layout-fixed layout-navbar-fixed layout-footer-fixed sidebar-mini'

  useEffect(() => {
    const body = document.body
    const previous = body.className

    body.classList.remove('login-page', 'sidebar-collapse')
    body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed', 'layout-navbar-fixed', 'layout-footer-fixed')

    return () => {
      body.className = previous
    }
  }, [user])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined
    }

    const updateSidebarWidth = () => {
      const sidebar = document.querySelector('.main-sidebar')

      if (sidebar) {
        const width = `${sidebar.getBoundingClientRect().width}px`
        const root = document.documentElement

        root.style.setProperty('--main-sidebar-width', width)
      }
    }

    updateSidebarWidth()

    window.addEventListener('resize', updateSidebarWidth)
    document.addEventListener('collapsed.lte.pushmenu', updateSidebarWidth)
    document.addEventListener('shown.lte.pushmenu', updateSidebarWidth)

    return () => {
      window.removeEventListener('resize', updateSidebarWidth)
      document.removeEventListener('collapsed.lte.pushmenu', updateSidebarWidth)
      document.removeEventListener('shown.lte.pushmenu', updateSidebarWidth)
    }
  }, [])

  return (
    <div className={wrapperClass}>
      <MainProvider>
        <Header />
        <Aside />
        <Container>{children}</Container>
        <Footer />
      </MainProvider>
    </div>
  )
}

export default ContainerMain
