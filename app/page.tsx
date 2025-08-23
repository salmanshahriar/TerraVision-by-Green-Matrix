"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/home/Map"), {
  ssr: false,
});

export default function HomePage() {
  return <Map /> ;
}
