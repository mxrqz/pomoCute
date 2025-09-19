"use client"

import { useState, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const themes = [
  { name: 'Claro', value: 'light', color: '#ffffff' },
  { name: 'Escuro', value: 'dark', color: '#0f172a' },
  { name: 'Oceano', value: 'ocean', color: '#f0f9ff' },
  { name: 'Floresta', value: 'forest', color: '#f7fdf7' },
  { name: 'Pôr do Sol', value: 'sunset', color: '#fef7f0' },
  { name: 'Lavanda', value: 'lavender', color: '#faf7ff' },
  { name: 'Rosa', value: 'rose', color: '#fef2f2' },
  { name: 'Café', value: 'coffee', color: '#fefcf8' },
  { name: 'Meia-noite', value: 'midnight', color: '#0a0a0f' },
  { name: 'Coral', value: 'coral', color: '#fff5f5' },
  { name: 'Índigo', value: 'indigo', color: '#f0f4ff' },
  { name: 'Esmeralda', value: 'emerald', color: '#f0fdf9' },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  const changeTheme = (theme: string) => {
    // Remove todas as classes de tema
    const allThemes = ['light', 'dark', 'ocean', 'forest', 'sunset', 'lavender', 'rose', 'coffee', 'midnight', 'coral', 'indigo', 'emerald']
    document.documentElement.classList.remove(...allThemes)

    // Adiciona a nova classe de tema
    if (theme !== 'light') {
      document.documentElement.classList.add(theme)
    }

    // Salva no localStorage
    localStorage.setItem('theme', theme)
    setCurrentTheme(theme)

    console.log('Tema alterado para:', theme)
    console.log('Classes atuais:', document.documentElement.className)
  }

  // Inicializar tema do localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setCurrentTheme(savedTheme)
    changeTheme(savedTheme)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Carregando tema...">
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Selecionar tema">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2">
          <h4 className="text-sm font-medium mb-2">Escolha um tema</h4>
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => changeTheme(theme.value)}
              className="flex items-center gap-2 p-2 cursor-pointer"
            >
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: theme.color }}
              />
              <span>{theme.name}</span>
              {currentTheme === theme.value && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}