"use client"

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

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { ScrollArea } from "./ui/scroll-area"
import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Pencil, Plus, Save, Trash2 } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

import { nanoid } from 'nanoid'

interface Note {
    id?: string;
    title?: string,
    description?: string;
    content?: string;
    notes?: Notes[];
    returnFunction?: (notes: Notes[]) => void;
}

interface Notes {
    id: string;
    title: string,
    description: string,
    content: string
}

export default function Note({ id, title, description, content, notes, returnFunction }: Note) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [currentTitle, setCurrentTitle] = useState<string>()
    const [currentDescription, setCurrentDescription] = useState<string>()
    const [currentNoteText, setCurrentNoteText] = useState<string>()

    useEffect(() => {
        if (!content) {
            setIsEditing(true)
        } else {
            setCurrentNoteText(content)
        }
    }, [content])

    const updateNotes = (updatedNotes: Notes[]) => {
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        if (returnFunction) {
            returnFunction(updatedNotes);
        }
    };

    const handleSave = () => {
        if (returnFunction && currentTitle && currentDescription && currentNoteText) {
            const newNote = {
                id: nanoid(5),
                title: currentTitle,
                description: currentDescription,
                content: currentNoteText
            }

            const oldNotes = localStorage.getItem('notes')
            const parsedNotes: Notes[] = oldNotes ? JSON.parse(oldNotes) : undefined

            const notes: Notes[] = oldNotes ? [...parsedNotes, newNote] : [newNote]

            returnFunction(notes)

            setCurrentTitle('')
            setCurrentDescription('')
            setCurrentNoteText('')
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
    return (
        <Sheet>
            <SheetTrigger asChild>
                {title && description ? (
                    <div className="w-full h-fit inline-flex items-center justify-between relative">
                        <Button variant={"outline"} className="h-fit w-full text-start">
                            <div className="w-full">
                                <span className="font-semibold text-lg">{title}</span>
                                <span className="text-sm text-muted-foreground line-clamp-1">{description}</span>
                            </div>
                        </Button>

                        <Button
                            className="absolute right-2 bg-transparent group hover:bg-red-500"
                            variant={"outline"}
                            size={"icon"}
                            onClick={(e) => handleDelete(e)}
                        >
                            <Trash2 className="text-red-500 group-hover:text-white transition-colors duration-300" />
                        </Button>
                    </div>
                ) : (
                    <Button>
                        <Plus />
                    </Button>
                )}
            </SheetTrigger>

            <SheetContent className="flex flex-col gap-5 min-w-[450px]">
                <SheetHeader className="space-y-0">
                    {title && description ? (
                        <>
                            <SheetTitle>{title}</SheetTitle>
                            <SheetDescription>{description}</SheetDescription>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <SheetTitle className="space-y-1">
                                <Label htmlFor="title" className="text-lg font-semibold text-foreground">Título:</Label>
                                <Input
                                    autoFocus
                                    id="title"
                                    placeholder="Adicione o título da tarefa"
                                    onChange={(e) => setCurrentTitle(e.currentTarget.value)}
                                />
                            </SheetTitle>

                            <SheetDescription className="space-y-1">
                                <Label htmlFor="description" className="text-sm text-muted-foreground">Descrição:</Label>
                                <Input
                                    id="description"
                                    placeholder="Adicione a descrição da tarefa"
                                    onChange={(e) => setCurrentDescription(e.currentTarget.value)}
                                />
                            </SheetDescription>
                        </div>
                    )}
                </SheetHeader>

                <div className="flex flex-col gap-1 h-full overflow-hidden">
                    <Label htmlFor="text-input" className="text-md">Nota:</Label>

                    <ScrollArea className="w-full border rounded-md h-full p-2 relative group">
                        {isEditing ? (
                            <>
                                <div className="inline-flex absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10">
                                    <Button className="inline-flex gap-2"
                                        onClick={() => setIsEditing(false)}
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
                                <div className="inline-flex absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10">
                                    <Button className="inline-flex gap-2"
                                        onClick={() => setIsEditing(true)}
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

                <div className="inline-flex gap-5 justify-end">
                    <Button variant={"outline"}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}