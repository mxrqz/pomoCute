"use client"

import { getUnlockedAchievements, achievementsList } from "@/functions/achievementsHandle";
import { Award } from "lucide-react";
import { PartyPopper, Handshake, Lightbulb, Trophy, Brain, Calendar, Sunrise, TrendingUp, Flame, Moon, CheckCircle, Pencil } from 'lucide-react';
import { Badge } from "./ui/badge";

const achievementIcons = [
    {
        name: 'firstSession',
        icon: <PartyPopper size={16} />
    },
    {
        name: "pomodoroBuddy",
        icon: <Handshake size={16} />
    },
    {
        name: "increasedFocus",
        icon: <Lightbulb size={16} />
    },
    {
        name: "pomodoroChampion",
        icon: <Trophy size={16} />
    },
    {
        name: "focusExpert",
        icon: <Brain size={16} />
    },
    {
        name: "monthlyMilestone",
        icon: <Calendar size={16} />
    },
    {
        name: "earlyBird",
        icon: <Sunrise size={16} />
    },
    {
        name: "consistentWorker",
        icon: <TrendingUp size={16} />
    },
    {
        name: "powerFocus",
        icon: <Flame size={16} />
    },
    {
        name: "eveningOwl",
        icon: <Moon size={16} />
    },
    {
        name: "taskExpert",
        icon: <CheckCircle size={16} />
    },
    {
        name: "noteTaker",
        icon: <Pencil size={16} />
    }
];

const getAchievementName = (id: string) => {
    const achievements = achievementsList()
    const achievement = achievements.find(a => a.id === id)

    return achievement?.name
}

const getAchievementIcon = (id: string) => {
    const teste = achievementIcons.find(a => a.name === id)
    return teste?.icon
}

export default function Achievements() {
    const achievements = getUnlockedAchievements()

    const slicedAchivements = achievements.sort((a, b) => { return new Date(b.time).getTime() - new Date(a.time).getTime() }).slice(0, 3)
    return (
        <div className="flex flex-col gap-2">
            <span className="font-semibold flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Conquistas recentes
            </span>

            {achievements && (
                <div className="grid grid-cols-3 gap-2">
                    {slicedAchivements.map((a, i) => (
                        <Badge key={i} variant={"secondary"} className="grid grid-cols-[15%,85%] gap-2 place-items-center px-2 py-1">
                            {getAchievementIcon(a.id)}
                            {getAchievementName(a.id)}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}