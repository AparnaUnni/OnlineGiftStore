import React from 'react'
import { Facebook, Instagram, Dribbble, Linkedin } from 'lucide-react';


const Footer = () => {
  return (
    <div id="contact" className=" bg-white flex flex-col md:flex-row justify-between items-start px-12 py-16 gap-25 mx-auto">
      {/* Left Side - Text + Social Icons */}
      <div className="md:w-1/2">
        <h1 className="text-black font-bold text-3xl mb-6">Let's Work Together</h1>
        <p className="text-black text-base mb-6 leading-relaxed">
          This is a template Figma file, turned into code using Anima. Learn more at AnimaApp.com
        </p>
        <div className="flex gap-6">
          <Facebook className="text-black w-6 h-6" />
          <Instagram className="text-black w-6 h-6" />
          <Dribbble className="text-black w-6 h-6" />
          <Linkedin className="text-black w-6 h-6" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2">
        <form className="flex flex-col gap-4  mr-10">
          <input
            type="text"
            placeholder="Name"
            className="text-black w-full px-4 py-4 bg-gray-100  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="text-black w-full px-4 py-4 bg-gray-100  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 w-[181px] h-[68px]  hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Footer