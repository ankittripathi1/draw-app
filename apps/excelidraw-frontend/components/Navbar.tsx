"use client"
import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"
import {useScroll} from 'framer-motion'
import Link from "next/link"

export default function Navbar(){
  
  
  return <header className= {`flex items-center h-14 fixed  bg-transparent w-full px-20 `}>
    <nav className="flex items-center justify-between w-full">
      {/* logo */}
      <h1 className="text-2xl font-bold cursor-pointer">Sketch Forge</h1>
      <div className="flex gap-x-10">
      {/* items */}
        <ul className="flex gap-x-8 items-center text-base font-semibold ">
          <Link className="cursor-pointer " href="/">
            Home
          </Link>
          <Link className="text-gray-700 cursor-pointer"href="/">
           features 
          </Link>
          <Link className="text-gray-700 cursor-pointer" href="/discover">
           discover 
          </Link>
        </ul>
      {/* button */}
      <Button>Login</Button>

      </div>
    </nav>
  </header>
}
