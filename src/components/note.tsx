"use client"

import { useState } from "react"
import { Pencil, Plus, Save, Trash2 } from "lucide-react"
import { nanoid } from 'nanoid'

import Markdown from 'react-markdown'
import rehypeFormat from 'rehype-format'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import type { Notes, Note } from '@/types/types'

// Dps deixar o usuario editar o titulo e descrição de uma nota ja criada

export default function Note({ id, title, description, content, notes, returnFunction }: Note) {
    // const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
    // const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(content ? false : true)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [currentDescription, setCurrentDescription] = useState<string>('')
    const [currentNoteText, setCurrentNoteText] = useState<string>(content ? content : '')

    const handleSave = () => {
        if (returnFunction && currentTitle && currentDescription && currentNoteText) {
            const newNote = {
                id: nanoid(5),
                title: currentTitle,
                description: currentDescription,
                content: currentNoteText
            }

            const oldNotes = localStorage.getItem('notes')
            const parsedNotes: Notes[] = oldNotes ? JSON.parse(oldNotes) : []

            const notes: Notes[] = oldNotes ? [...parsedNotes, newNote] : [newNote]

            returnFunction(notes)

            resetStates()
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
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {title && description ? (
                    <div className="w-full h-fit inline-flex items-center justify-between relative">
                        <Button variant={"outline"} className="h-fit w-full text-start focus-visible:border focus-visible:border-ring focus-visible:ring-0" aria-label={`Abrir nota rápida ${title}`}>
                            <div className="w-full">
                                <span className="font-semibold text-lg">{title}</span>
                                <span className="text-sm text-muted-foreground line-clamp-1">{description}</span>
                            </div>
                        </Button>

                        <Button
                            aria-label={`Deletar nota rápida ${title}`}
                            className="absolute right-2 bg-transparent group hover:bg-red-500 focus-visible:ring-red-500"
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

            <SheetContent className="flex flex-col gap-5 min-w-[450px]">
                <SheetHeader className="space-y-0">
                    {title && description ? (
                        <>
                            {/* {isEditingTitle ? (
                                <SheetTitle className="space-y-1">
                                    <Label htmlFor="titulo" className="text-lg font-semibold text-foreground">Título:</Label>
                                    <Input
                                        autoFocus
                                        id="titulo"
                                        placeholder="Adicione o título da tarefa"
                                        value={currentTitle}
                                        onChange={(e) => setCurrentTitle(e.currentTarget.value)}
                                    />
                                </SheetTitle>
                            ) : (
                            )} */}
                                <SheetTitle className="group">
                                    {title}
                                    {/* <Pencil size={16} className="opacity-100 group-hover:opacity-100" /> */}
                                </SheetTitle>

                            {/* {isEditingDesc ? (
                                <SheetDescription className="space-y-1">
                                    <Label htmlFor="descrição" className="text-sm text-muted-foreground">Descrição:</Label>
                                    <Input
                                        id="descrição"
                                        placeholder="Adicione a descrição da tarefa"
                                        value={currentDescription}
                                        onChange={(e) => setCurrentDescription(e.currentTarget.value)}
                                    />
                                </SheetDescription>
                            ) : (
                            )} */}
                            <SheetDescription>{description}</SheetDescription>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <SheetTitle className="space-y-1">
                                <Label htmlFor="titulo" className="text-lg font-semibold text-foreground">Título:</Label>
                                <Input
                                    autoFocus
                                    id="titulo"
                                    placeholder="Adicione o título da tarefa"
                                    value={currentTitle}
                                    onChange={(e) => setCurrentTitle(e.currentTarget.value)}
                                />
                            </SheetTitle>

                            <SheetDescription className="space-y-1">
                                <Label htmlFor="descrição" className="text-sm text-muted-foreground">Descrição:</Label>
                                <Input
                                    id="descrição"
                                    placeholder="Adicione a descrição da tarefa"
                                    value={currentDescription}
                                    onChange={(e) => setCurrentDescription(e.currentTarget.value)}
                                />
                            </SheetDescription>
                        </div>
                    )}
                </SheetHeader>

                <div className="flex flex-col gap-1 h-full overflow-hidden">
                    <Label htmlFor="text-input" className="text-md">Nota:</Label>

                    <ScrollArea className="w-full border rounded-md h-full p-2 relative group focus-within:border-ring">
                        {isEditing ? (
                            <>
                                <div className="inline-flex absolute top-2 right-2 z-10">
                                    <Button className="inline-flex gap-2 focus-visible:ring-red-500 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                                        onClick={() => setIsEditing(false)}
                                        aria-label="Salvar edição da nota"
                                    >
                                        <Save size={16} className="shrink-0" />
                                        Salvar
                                    </Button>
                                </div>

                                <Textarea
                                    id="text-input"
                                    className="w-full h-full border-none p-0 py-0 focus-visible:ring-0"
                                    value={currentNoteText}
                                    onChange={(e) => setCurrentNoteText(e.currentTarget.value)}
                                />
                            </>
                        ) : (
                            <>
                                <div className="inline-flex absolute top-2 right-2 z-10">
                                    <Button className="inline-flex gap-2 focus-visible:ring-red-500 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
                                        onClick={() => setIsEditing(true)}
                                        aria-label="Editar nota rápida"
                                    >
                                        <Pencil size={16} className="shrink-0" />
                                        Editar
                                    </Button>
                                </div>

                                <Markdown className="prose dark:prose-invert"
                                    remarkPlugins={[remarkGfm, remarkMath, remarkParse, remarkFrontmatter, remarkDirective, remarkDirective, remarkRehype]}
                                    rehypePlugins={[rehypeStringify, rehypeRaw, rehypeFormat, rehypeSanitize]}
                                >
                                    {currentNoteText}
                                </Markdown>
                            </>
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