import React, { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../firebase/auth';
import { Link, Links } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../firebase/logout';

const Navbar = () => {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-10 lg:px-36 py-5'  >
        <Link to="/" ><img src="./logo.svg" className='cursor-pointer w-25 h-15 md:h-17 mr-5' alt="" /></Link>
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center text-white gap-7 min-md:px-9 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-white overflow-hidden transition-[width] duration-350  ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`} >
          <XIcon className='md:hidden absolute top-6 right-6  w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

          <a href="#how" onClick={() => setIsOpen(false)} className="hover:text-[#FF6B35] transition cursor-pointer">
            How It Works
          </a>
          <a href="#portfolio" onClick={() => setIsOpen(false)} className="hover:text-[#FF6B35] transition cursor-pointer">
            Portfolio
          </a>
          <a href="#why" onClick={() => setIsOpen(false)} className="hover:text-[#FF6B35] transition cursor-pointer">
            Why MadeIt?
          </a>
          <Link to="/contact-us" className="hover:text-[#FF6B35] transition">Contact Us</Link>

        </div>

        <div className='flex items-center gap-3' >
          {
            !user ? (
              <button onClick={() => signInWithGoogle(navigate)} className='px-6 py-2 bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-sm cursor-pointer font-medium rounded-full transition-colors' >Start Building</button>
            ) : (

              <button onClick={async () => {
                await logoutUser();
                navigate("/");
              }} className='px-6 py-2 bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-sm cursor-pointer font-medium rounded-full transition-colors' >Logout</button>
            )
          }
        </div>



        <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

      </div>
    </motion.nav>
  );
}

export default Navbar