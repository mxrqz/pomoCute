"use client"

import { ThemeSelector } from "@/components/theme-selector";
import Pomodoro from "@/components/pomodoro";

import { Clock, Menu } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

export default function Home() {
  const [timer, setTimer] = useState<{ timer: number; break: number, cycles: number, longBreak: number }>()

  const handleSelectedTime = (selectedTime: { timer: number; break: number, cycles: number, longBreak: number }) => {
    setTimer(selectedTime)
  }

  return (
    <>
      {/* Skip links for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Pular para conteúdo principal
      </a>
      <a
        href="#timer-controls"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-48 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Pular para controles do timer
      </a>

      <PomodoroProvider>
        <nav className="flex items-center justify-between py-2 sm:py-3 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 ios-safe-top" role="navigation" aria-label="Navegação principal">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">PomoCute</h1>

          <div className="md:inline-flex gap-5 hidden" role="group" aria-label="Controles da aplicação">
            <Stats />

            <ThemeSelector />

            <UserData />
          </div>

          <Sheet>
            <SheetTrigger className="flex flex-col md:hidden" aria-label="Abrir menu de navegação">
              <Menu aria-hidden="true" />
            </SheetTrigger>

            <SheetContent className="flex flex-col gap-4 pt-8" aria-label="Menu de navegação">
              <div className="flex flex-col gap-4">
                <UserData />

                <Stats />

                <div className="flex justify-center">
                  <ThemeSelector />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>

        <main id="main-content" className="w-full min-h-[calc(100vh-140px)] md:h-full md:overflow-hidden flex flex-col md:flex-row justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-10 py-2 sm:py-3 md:py-5 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32" role="main" aria-label="Conteúdo principal">
          <section className="w-full flex flex-col gap-2 sm:gap-3 md:gap-5" aria-label="Timer Pomodoro e música">
            <Pomodoro selectedTime={handleSelectedTime} />

            {URL && (
              <YtIframe videoURL={URL} />
            )}
          </section>

          <Separator orientation="vertical" className="hidden md:inline-block" aria-hidden="true" />
          <Separator orientation="horizontal" className="inline-block md:hidden" aria-hidden="true" />

          <section className="w-full flex-1 flex flex-col md:grid md:grid-rows-[1fr,2px,1fr] lg:overflow-hidden gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10" aria-label="Tarefas e notas">
            <div className="flex-1 min-h-0">
              <Tasks />
            </div>

            <Separator aria-hidden="true" />

            <div className="flex-1 min-h-0">
              <QuickNotes />
            </div>
          </section>
        </main>

        <footer className="w-full flex flex-col justify-center items-center bg-foreground/10 text-muted-foreground py-2 sm:py-3 md:py-5 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 ios-safe-bottom" role="contentinfo" aria-label="Informações sobre a técnica Pomodoro">
          <p className="text-center text-sm sm:text-base mb-1 sm:mb-2">
            Mantenha o foco e aumente sua produtividade com a Técnica Pomodoro.
          </p>
          <div className="inline-flex items-center text-xs sm:text-sm text-center" role="status" aria-label="Configuração atual do timer">
            <Clock className="mr-2 size-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {timer?.timer} minutos de trabalho, {timer?.break} minutos de pausa, {timer?.longBreak} minutos de pausa longa após {timer?.cycles} ciclos.
            </span>
            <span className="sm:hidden">
              {timer?.timer}min trabalho / {timer?.break}min pausa
            </span>
          </div>
        </footer>
      </PomodoroProvider>

      <Toaster />
    </>
  );
}
