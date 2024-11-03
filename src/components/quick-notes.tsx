"use client"

import Note from "./note";
import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

// const markdownText = `
// # Pluto

// **Pluto** (minor-planet designation: *134340 Pluto*)
// is a
// [dwarf planet](https://en.wikipedia.org/wiki/Dwarf_planet)
// in the
// [Kuiper belt](https://en.wikipedia.org/wiki/Kuiper_belt).

// ## History

// In the 1840s,
// [Urbain Le Verrier](https://wikipedia.org/wiki/Urbain_Le_Verrier)
// used Newtonian mechanics to predict the position of the
// then-undiscovered planet
// [Neptune](https://wikipedia.org/wiki/Neptune)
// after analyzing perturbations in the orbit of
// [Uranus](https://wikipedia.org/wiki/Uranus).

// ***

// Just a link: www.nasa.gov.

// * Lists
// * [ ] todo
// * [x] done

// A table:

// | a | b |
// | - | - |
// | valor 1 | valor 2 |

// <details><summary>Show example</summary>

// ~~~js
// console.log('Hi pluto!')
// ~~~

// </details>
// `;

interface Notes {
    id: string,
    title: string,
    description: string,
    content: string
}

export default function QuickNotes() {
    const lastTaskRef = useRef<HTMLLIElement>(null)

    const [notes, setNotes] = useState<Notes[]>()

    useEffect(() => {
        if (lastTaskRef.current) {
            lastTaskRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const getNotes = () => {
        const notesString = localStorage.getItem('notes')
        if (notesString) {
            const notes = JSON.parse(notesString)
            // console.log(notes)
            setNotes(notes)
        }
    }

    useEffect(() => {
        getNotes()
    }, [])

    const handleReturnFunction = (notes: Notes[]) => {
        setNotes(notes)
        localStorage.setItem('notes', JSON.stringify(notes))
    }

    return (
        <div className="w-full flex flex-col gap-5 items-center overflow-hidden">
            <h3 className="text-3xl font-bold">Notas Rápidas</h3>

            <div className="flex flex-col gap-5 justify-between w-full h-full overflow-hidden">
                <ScrollArea className="w-full h-full">
                    <div className="flex flex-col gap-2">
                        {notes?.map((note, index) => (
                            <Note
                                key={index}
                                id={note.id}
                                title={note.title}
                                description={note.description}
                                content={note.content}
                                notes={notes}
                                returnFunction={handleReturnFunction}
                            />
                        ))}
                    </div>
                </ScrollArea>

                <Note returnFunction={handleReturnFunction} />
            </div>
        </div>
    )
}