"use client";

import Navbar from '@/components/layout/Navbar'
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/home/Map"), {
  ssr: false, // disables server-side rendering
});

export default function HomePage() {
  return (
    <div>
       <Navbar/>
      <Map />
    </div>
  );
}
