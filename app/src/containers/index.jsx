import '/res/admin/dist/css/skins/skin-blue.min.css'
import '/res/admin/dist/css/skins/skin-green.min.css'
import '/res/admin/dist/css/skins/skin-purple.min.css'
import '/res/admin/dist/css/skins/skin-red.min.css'
import '/res/admin/dist/css/skins/skin-yellow.min.css'

import { useContext } from "react"

import Header from '../components/Main/header'
import Aside from '../components/Main/aside'
import Footer from '../components/Main/footer'
import Container from '../components/Container'
import { AuthContext } from '../contexts/context'
import { MainProvider } from '../contexts/main'

const ContainerMain = ({ children }) => {

  const { user } = useContext(AuthContext)
  
  const classWrapper = `wrapper ${user.descor}`

  return (
    <>
      <div className={classWrapper}>
        <MainProvider>
          <Header />
          <Aside />
          <Container>
            {children}
          </Container>
          <Footer />  
        </MainProvider>
      </div>
    </>

  )
}

export default ContainerMain