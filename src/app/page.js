import Image from "next/image";
import Header from './components/Header';
import Hero from './components/Hero';
import { Button } from "@mui/material";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <>
    <Header />
    <Hero />
    <Footer />
    </>
  );
}
