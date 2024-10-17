"use client"

import { ModeToggle } from "@/components/ui/mode-toggle";
import Pomodoro from "@/components/pomodoro";

import { Inter } from "next/font/google"
import { Clock } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Tasks from "@/components/tasks";
import QuickNotes from "@/components/quick-notes";
import Settings from "@/components/settings";
import YtIframe from "@/components/ytIframe";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [timer, setTimer] = useState<{ timer: number; break: number, cycles: number, longBreak: number }>()

  const [type, setType] = useState<"Video" | "Playlist">()
  const [URL, setURL] = useState<string>()
  const [autoplay, setAutoplay] = useState<boolean>()

  const handleSelectedTime = (selectedTime: { timer: number; break: number, cycles: number, longBreak: number }) => {
    setTimer(selectedTime)
  }

  const handleSettings = (settings: { mediaType: "Video" | "Playlist", URL: string, autoplay: boolean }) => {
    setType(settings.mediaType)
    setURL(settings.URL)
    setAutoplay(settings.autoplay)
  }

  return (
    <>
      <nav className="flex items-center justify-between py-5 sm:px12 lg:px-32 2xl:px-64">
        <h2 className="text-3xl font-semibold tracking-tight">PomoCute</h2>

        <div className="inline-flex gap-5">
          <Settings settings={handleSettings} />
          <ModeToggle />
        </div>
      </nav>

      <section className="w-full h-full overflow-hidden flex items-center justify-between gap-10 py-5 sm:px12 lg:px-32 2xl:px-64">
        <div className="w-full flex flex-col gap-5">
          <Pomodoro selectedTime={handleSelectedTime} />

          {type && URL && autoplay && (
            <YtIframe videoURL={URL} playlist={type === "Playlist"} autoplay={autoplay} index={0} />
          )}
        </div>

        <Separator orientation="vertical" />

        <div className="w-full h-full grid grid-rows-[1fr,2px,1fr] overflow-hidden gap-10">
          <Tasks />

          <Separator />

          <QuickNotes />
        </div>
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
