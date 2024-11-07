"use client"

import { useRef, useEffect, useState } from "react";

import type { Notes } from "@/types/types";

import { stats, updateQuickNotesCount } from "@/functions/statsHandle";

import Note from "@/components/note";
import { ScrollArea } from "@/components/ui/scroll-area";
import { newAchievement } from "@/components/newAchievementNoti";

import { checkAchievements } from "@/functions/achievementsHandle";

const defaultNote = {
    id: 'firtsNote',
    "title": "Bem-vindo ao PomoCute!",
    "description": "Primeira nota de exemplo para ajudar você a organizar suas ideias.",
    "content": "# Dicas para Usar o PomoCute 🐱\n\nOlá! Esta é sua primeira nota no PomoCute. Você pode formatar seu texto usando **Markdown** para deixá-lo mais organizado e estilizado.\n\n## Exemplos de Markdown\n\n- **Negrito**: Use `**palavra**` para negrito.\n- _Itálico_: Use `_palavra_` para itálico.\n- [Links](https://pomocute.com): Use `[texto](url)` para links.\n\n### Organize suas ideias!\n\n- Crie listas de tarefas\n- Mantenha notas importantes\n- Personalize seu Pomodoro com música e estatísticas\n\nAproveite e seja produtivo! 😊"
}

export default function QuickNotes() {
    // const lastTaskRef = useRef<HTMLLIElement>(null)
    const [notes, setNotes] = useState<Notes[]>()

    // useEffect(() => {
    //     if (lastTaskRef.current) {
    //         lastTaskRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, []);

    useEffect(() => {
        const notesString = localStorage.getItem('notes')
        if (notesString) setNotes(JSON.parse(notesString))
        else {
            const statistics = stats()
            if (statistics.quickNotes === 0) {
                setNotes([defaultNote])
            }
        }
    }, [])

    const handleReturnFunction = (newNotes: Notes[]) => {
        setNotes(newNotes)
        localStorage.setItem('notes', JSON.stringify(newNotes))

        if (notes && newNotes.length > notes.length) {
            updateQuickNotesCount()
            const achievement = checkAchievements()
            if (achievement) newAchievement(achievement)
        }
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