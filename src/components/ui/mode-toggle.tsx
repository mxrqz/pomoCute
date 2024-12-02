"use client"

import * as React from "react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col">
                <DropdownMenuItem className="inline-flex gap-2"
                    onClick={() => setTheme("light")}
                >
                    <Sun className="size-4" />
                    Light
                </DropdownMenuItem>

                <DropdownMenuItem className="inline-flex gap-2"
                    onClick={() => setTheme("dark")}
                >
                    <Moon className="size-4" />
                    Dark
                </DropdownMenuItem>
                
                <DropdownMenuItem className="inline-flex gap-2"
                    onClick={() => setTheme("system")}
                >
                    <Laptop className="size-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
