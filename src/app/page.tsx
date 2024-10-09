"use client"

import { ModeToggle } from "@/components/ui/mode-toggle";
import Pomodoro from "@/components/pomodoro";

import { Inter } from "next/font/google"
import { Clock } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Tasks from "@/components/tasks";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [timer, setTimer] = useState<{ timer: number; break: number, cycles: number, longBreak: number }>()

  const handleSelectedTime = (selectedTime: { timer: number; break: number, cycles: number, longBreak: number }) => {
    setTimer(selectedTime)
  }

  return (
    <>
      <nav className="flex items-center justify-between py-5 sm:px12 lg:px-32 2xl:px-64">
        <h2 className="text-3xl font-semibold tracking-tight">PomoCute</h2>
        <ModeToggle />
      </nav>

      <section className="w-full h-full overflow-hidden flex items-center justify-center gap-10 py-5 sm:px12 lg:px-32 2xl:px-64">
        <Pomodoro selectedTime={handleSelectedTime} />
        
        <Separator orientation="vertical" />

        <Tasks />
      </section>

      <footer className={`w-full flex flex-col justify-center items-center bg-foreground/10 text-muted-foreground py-5 sm:px12 lg:px-32 2xl:px-64 ${inter.className}`}>
        <span>Mantenha o foco e aumente sua produtividade com a Técnica Pomodoro.</span>
        <span className="inline-flex">
          <Clock className="mr-2" />
          {timer?.timer} minutos de trabalho, {timer?.break} minutos de pausa, {timer?.longBreak} minutos de pausa longa após {timer?.cycles} ciclos.
        </span>
      </footer>
    </>
  );
}
