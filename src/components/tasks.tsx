"use client"

import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { playToDoItemCompleted } from "./sounds"
import { Button } from "./ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Separator } from "./ui/separator"

interface Tasks {
    task: string,
    completed: boolean
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const input = useRef<HTMLInputElement>(null)
    const lastTaskRef = useRef<HTMLLIElement>(null)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)

    const handleEnter = (button: boolean, event?: KeyboardEvent<HTMLInputElement>) => {
        if (event && event.code === 'Enter') {
            if (!event.currentTarget || !input.current || event.currentTarget.value.trim() === '') return

            const newTask: Tasks = {
                task: event.currentTarget.value.trim(),
                completed: false
            }

            setTasks((task) => [...task, newTask])
            input.current.value = ''
        } else if (button) {
            if (!input.current || input.current.value.trim() === '' ) return

            const newTask: Tasks = {
                task: input.current.value.trim(),
                completed: false
            }

            setTasks((task) => [...task, newTask])
            input.current.value = ''
        }
    }

    const handleDeleteTask = (index: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task !== tasks[index]))
    }

    const handleChecked = (checked: boolean | string, index: number) => {
        setTasks(prevTasks =>
            prevTasks.map((task, i) =>
                i === index ? { ...task, completed: !!checked } : task
            )
        );

        if (checked) {
            playToDoItemCompleted();
        }
    };

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        } 

        setIsInitialized(true)
    }, []);

    useEffect(() => {
        if (lastTaskRef.current) {
            lastTaskRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [tasks]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks, isInitialized]);

    return (
        <div className="w-full h-full flex flex-col gap-5 items-center p-0 overflow-hidden">
            <h3 className="text-3xl font-bold">Tarefas Diárias</h3>

            <div className="w-full h-full flex flex-col gap-2 justify-between overflow-hidden">
                <ScrollArea className="w-full">
                    <ul className="w-full flex flex-col gap-5">
                        {tasks.map((task, index) => (
                            <li key={index} className="flex flex-col gap-1" ref={index === tasks.length - 1 ? lastTaskRef : null}>
                                <div className="inline-flex items-center gap-2 w-full">
                                    <Checkbox id={`taks-${index}`} defaultChecked={task.completed} onCheckedChange={checked => handleChecked(checked, index)} />
                                    <Label htmlFor={`taks-${index}`} className="w-full h-full">{task.task}</Label>

                                    <Button className="w-fit h-fit bg-transparent mr-4 p-2"
                                        variant={"destructive"}
                                        onClick={() => handleDeleteTask(index)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>

                                <Separator />
                            </li>
                        ))}
                    </ul>

                    <ScrollBar orientation="vertical" />
                </ScrollArea>

                <div className="w-full inline-flex items-center gap-2">
                    <Input className="focus-visible:ring-0 focus-visible:border-ring min-h-9"
                        ref={input}
                        placeholder="Adicione uma nova Tarefa"
                        onKeyDown={e => handleEnter(false, e)}
                        aria-label="Digite a tarefa que deseja adicionar"
                    />

                    <Button className="min-h-9 aspect-square border flex items-center justify-center rounded-md p-0 focus-visible:border focus-visible:border-red-500 focus-visible:ring-0"
                        aria-label="Adicionar nova tarefa"
                        onClick={() => handleEnter(true)}
                    >
                        <Plus />
                    </Button>
                </div>
            </div>
        </div>
    )
}