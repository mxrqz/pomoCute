"use client"

import { ModeToggle } from "@/components/ui/mode-toggle";
import Pomodoro from "@/components/pomodoro";

import { Clock } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Tasks from "@/components/tasks";
import QuickNotes from "@/components/quick-notes";
// import Settings from "@/components/settings";
import YtIframe from "@/components/ytIframe";
import UserData from "@/components/user-data";
import { PomodoroProvider } from "@/components/PomodoroProvider";
import Stats from "@/components/stats";
import { Toaster } from "@/components/ui/sonner"

// const type = "Video"
const URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

export default function Home() {
  const [timer, setTimer] = useState<{ timer: number; break: number, cycles: number, longBreak: number }>()

  // const [type, setType] = useState<"Video" | "Playlist">("Video")
  // const [URL, setURL] = useState<string>("https://www.youtube.com/watch?v=jfKfPfyJRdk")
  // const [autoplay, setAutoplay] = useState<boolean>(true)
  // const [index, setIndex] = useState<number>(0)

  const handleSelectedTime = (selectedTime: { timer: number; break: number, cycles: number, longBreak: number }) => {
    setTimer(selectedTime)
  }

  // const handleSettings = (settings: { mediaType: "Video" | "Playlist", URL: string, autoplay: boolean | undefined, index: number }) => {
  //   setType(settings.mediaType)
  //   setURL(settings.URL)
  //   setAutoplay(settings.autoplay)
  //   setIndex(settings.index)
  // }

  // const [cycles, setCycles] = useState<number>(0)
  // const [isActive, setIsActive] = useState<boolean>(false)

  // const handleCycles = (cycles: number) => {
  //   setCycles(cycles)
  // }

  // const handleIsActive = (isActive: boolean) => {
  //   setIsActive(isActive)
  // }

  return (
    <>
      <PomodoroProvider>
        <nav className="flex items-center justify-between py-2 sm:px12 lg:px-32 2xl:px-64">
          <h2 className="text-3xl font-semibold tracking-tight">PomoCute</h2>

          <div className="inline-flex gap-5">
            <Stats />
            {/* <Settings settings={handleSettings} /> */}
            <ModeToggle />

            <UserData />
          </div>
        </nav>

        <section className="w-full h-full overflow-hidden flex justify-between gap-10 py-5 sm:px12 lg:px-32 2xl:px-64">
          <div className="w-full flex flex-col gap-10">
            <Pomodoro selectedTime={handleSelectedTime} />

            {URL && (
              <YtIframe videoURL={URL} />
            )}
          </div>

          <Separator orientation="vertical" />

          <div className="w-full h-full grid grid-rows-[1fr,2px,1fr] overflow-hidden gap-10">
            <Tasks />

            <Separator />

            <QuickNotes />
          </div>
        </section>

        <footer className={`w-full flex flex-col justify-center items-center bg-foreground/10 text-muted-foreground py-5 sm:px12 lg:px-32 2xl:px-64`}>
          <span>Mantenha o foco e aumente sua produtividade com a Técnica Pomodoro.</span>
          <span className="inline-flex">
            <Clock className="mr-2" />
            {timer?.timer} minutos de trabalho, {timer?.break} minutos de pausa, {timer?.longBreak} minutos de pausa longa após {timer?.cycles} ciclos.
          </span>
        </footer>
      </PomodoroProvider>

      <Toaster />
    </>
  );
}
