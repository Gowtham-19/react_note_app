import React from 'react'
import { Navbar, NavbarBrand } from 'reactstrap'

const Header = () => {
  return (
    <Navbar className='header-color' light>
      
      <NavbarBrand className='text-white m-auto'>
     
      <img src="https://static.thenounproject.com/png/3241394-200.png" style={{width:90}} />
      <span>Notes App</span>  
      </NavbarBrand>
    </Navbar>
  )
}

export default Header