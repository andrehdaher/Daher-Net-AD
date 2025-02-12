import React from 'react'
import Navbar from '../../compontes/Navbar'
import axios from 'axios'
import { useState } from "react";

const Search = () => {
  const [search , setsearch] = useState('')
  const pageSearch = (e)=>{
    e.preventDefault()
    axios.post("http://localhost:3000/search",{search}).then(() => {

    }
    ).catch((err) => {
      console.log(err)
      
    }
    )

  }



  return (
    <div className='relative'>
      <Navbar/>
<div className='absolute bottom-32'>
<h1 className='mx-16 my-1'>Search</h1>
        <input onChange={(e)=>setsearch(e.target.value)} type="number" className='border-2 border-indigo-600 rounded' />
        <button onClick={pageSearch} className='mx-5 bg-cyan-500 w-20 rounded text-white font-light'>Search</button>
        <br />
        <br />
        <br />
    <ul >
      <li className='mx-16 my-1'>FullName</li>
      <input type="text" className='border-2 border-indigo-600 rounded' />
      <br />
      <li className='mx-16 my-1'>Number</li>
      <input type="number" className='border-2 border-indigo-600 rounded' />
      <br />
      <li className='mx-16 my-1'>Company</li>
      <input type="text" className='border-2 border-indigo-600 rounded' />
      <br />
      <li className='mx-16 my-1'>Speed</li>
      <input type="number" className='border-2 border-indigo-600 rounded' />
      <br />
      <li className='mx-16 my-1'>Date</li>
      <input type="text" className='border-2 border-indigo-600 rounded' />
      <br />  
    </ul>
        
</div>
      
    </div>
  )
}

export default Search
