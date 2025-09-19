"use client"

import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { nanoid } from 'nanoid'
import { useEffect, useState } from "react"

import { SimpleMarkdown } from '@/components/ui/simple-markdown'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"

import type { Note, Notes } from '@/types/types'

export default function Note({ id, title, description, content, notes, returnFunction }: Note) {
    const [isEditing, setIsEditing] = useState<boolean>(content ? false : true)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [currentDescription, setCurrentDescription] = useState<string>('')
    const [currentNoteText, setCurrentNoteText] = useState<string>(content ? content : '')

    const handleSave = () => {
        const oldNotes = localStorage.getItem('notes')
        const parsedNotes: Notes[] = oldNotes ? JSON.parse(oldNotes) : []
        const newId = nanoid(5)
        let noteExists = false;

        for (const note of parsedNotes) {
            if (note.id === id) {
                note.content = currentNoteText;
                note.description = currentDescription;
                note.title = currentTitle;
                noteExists = true;
                break;
            }
        }

        if (!noteExists && currentTitle && currentDescription && currentNoteText) {
            const newNote = {
                id: newId,
                title: currentTitle,
                description: currentDescription,
                content: currentNoteText
            };
            parsedNotes.push(newNote);
        }

        if (returnFunction) {
            returnFunction(parsedNotes)
        }
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (id && notes) {
            const notesFiltered: Notes[] | undefined = notes.filter((note) => note.id !== id)

            if (notesFiltered && returnFunction) {
                returnFunction(notesFiltered)
            }
        }
    }

    const resetStates = () => {
        setCurrentTitle('')
        setCurrentDescription('')
        setCurrentNoteText('')
        setIsEditing(content ? false : true)
    }

    useEffect(() => {
        if (title && description && content) {
            setCurrentTitle(title)
            setCurrentDescription(description)
            setCurrentNoteText(content)
        }
    }, [description, title, content])

    const handleOpenChange = (open: boolean) => {
        if (!open) resetStates()
    }

    return (
        <Sheet onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                {title && description ? (
                    <div className="w-full h-fit grid grid-cols-[85%,15%] items-center rounded-md border focus-visible:border focus-visible:border-ring focus-visible:ring-0 relative">
                        <Button variant={"outline"} className="border-none h-fit w-full flex justify-start text-start " aria-label={`Abrir nota rápida ${title}`}>
                            <div className="w-full overflow-hidden">
                                <span className="font-semibold text-lg text-primary">{title}</span>
                                <span className="text-sm text-muted-foreground line-clamp-1">{description}</span>
                            </div>
                        </Button>

                        <Button
                            aria-label={`Deletar nota rápida ${title}`}
                            className="right-2 bg-transparent group hover:bg-red-500 focus-visible:ring-red-500"
                            variant={"outline"}
                            size={"icon"}
                            onClick={(e) => handleDelete(e)}
                        >
                            <Trash2 className="text-red-500 group-hover:text-white transition-colors duration-300" />
                        </Button>
                    </div>
                ) : (
                    <Button className="focus-visible:border focus-visible:border-red-500 focus-visible:ring-0" aria-label="Adicionar nova nota rápida">
                        <Plus />
                    </Button>
                )}
            </SheetTrigger>

            <SheetContent className="flex flex-col gap-5 w-[80%] md:w-[40%]">
                <div className="inline-flex justify-between gap-2 items-center mt-2">
                    <div className="inline-flex items-center gap-2">
                        {isEditing ? (
                            <Pencil size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                        <span className="text-primary">Modo de {isEditing ? 'Edição' : 'Visualização'}</span>
                    </div>

                    <Toggle
                        className="inline-flex gap-2 items-center"
                        pressed={isEditing}
                        variant={"outline"}
                        onPressedChange={setIsEditing}
                    >
                        {isEditing ? (
                            "Visualizar"
                        ) : (
                            "Editar"
                        )}
                    </Toggle>
                </div>

                <SheetHeader>
                    {isEditing ? (
                        <>
                            <Input
                                autoFocus
                                placeholder="Adicione o título da tarefa"
                                value={currentTitle ? currentTitle : title}
                                onChange={(e) => setCurrentTitle(e.target.value)}
                                className="text-lg font-semibold"
                            />
                            <SheetTitle></SheetTitle>
                        </>
                    ) : (
                        <SheetTitle>{currentTitle ? currentTitle : (title ? title : '')}</SheetTitle>
                    )}
                    {isEditing ? (
                        <>
                            <Input
                                placeholder="Adicione a descrição da tarefa"
                                value={currentDescription ? currentDescription : description}
                                onChange={(e) => setCurrentDescription(e.target.value)}
                                className="text-sm text-muted-foreground"
                            />
                            <SheetDescription></SheetDescription>
                        </>
                    ) : (
                        <SheetDescription>{currentDescription ? currentDescription : (description ? description : '')}</SheetDescription>
                    )}
                </SheetHeader>

                <div className="flex flex-col gap-2 h-full overflow-hidden">
                    <div className="inline-flex items-center justify-between">
                        <Label htmlFor="text-input" className="text-md text-primary">Nota:</Label>
                    </div>

                    <ScrollArea className="w-full border rounded-md h-full p-2 relative group focus-within:border-ring">
                        {isEditing ? (
                            <Textarea
                                placeholder="Adicione sua nota"
                                id="text-input"
                                className="w-full h-full border-none p-0 py-0 focus-visible:ring-0"
                                value={currentNoteText ? currentNoteText : (content ? content : '')}
                                onChange={(e) => setCurrentNoteText(e.currentTarget.value)}
                            />
                        ) : (
                            <SimpleMarkdown className="text-sm">
                                {currentNoteText ? currentNoteText : content || ''}
                            </SimpleMarkdown>
                        )}
                    </ScrollArea>
                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant={"outline"} onClick={resetStates}>Cancelar</Button>
                    </SheetClose>

                    <SheetClose asChild>
                        <Button onClick={handleSave} className="focus-visible:ring-red-500">Salvar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}