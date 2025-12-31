import React from 'react'
import Header from './Header'
import Footer from './Footer'

const CustomLayout = ({children}) => {
  return (
    <div>
      <Header/>
      
      <main className="pt-16">{children}</main>
      <Footer/>
      </div>
  )
}

export default CustomLayout