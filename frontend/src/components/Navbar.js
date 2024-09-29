 import Image from 'next/image'; 
import image from "../../public/mall.jpg"; 
import Link from 'next/link';
import { ModeToggle } from './toggle';

export default function Navbar() {
  return (
    <nav className="bg-blue-500 dark:bg-[#1e1d1d] p-4 flex justify-between items-center">
      <div className="flex items-center text-white text-lg font-bold sm:ml-20">
        <Image
          src={image}
          alt="Logo" 
          width={50} 
          height={50} 
          className="mr-2" 
        />
        Logo
      </div>
      <div className="space-x-4 sm:mr-28">
        <Link href="/login" className="text-white hover:text-blue-300">Login</Link>
        <Link href="/signup" className="text-white hover:text-blue-300">Sign Up</Link>
         <ModeToggle/>
      </div>
    </nav>
  );
}
