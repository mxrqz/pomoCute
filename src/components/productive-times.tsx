"use client"

import { Calendar, Clock } from "lucide-react";

import { Badge } from "./ui/badge";
import { ProductiveTime } from "@/types/types";

function getMostProductiveTimes(times: string[]) {
    const roundToHalfHour = (time: string): string => {
        const [hour, minute] = time.split(":").map(Number);
        const roundedMinute = minute < 30 ? "00" : "30";
        return `${String(hour).padStart(2, "0")}:${roundedMinute}`;
    };

    const frequency = times.reduce((acc: { [key: string]: number }, time: string) => {
        const interval = roundToHalfHour(time);
        acc[interval] = (acc[interval] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(frequency)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, 4)
        .map(item => item[0]);
}

export default function ProductiveTimes({ statistics }: ProductiveTime) {
    const monthlyTimes = statistics.monthly.length !== 0 ? statistics.monthly[statistics.monthly.length - 1].times : []
    const productiveTimes = getMostProductiveTimes(monthlyTimes)

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Horários de Produtividade
            </h4>
            <div className="grid grid-cols-4 gap-2">
                {productiveTimes.map((time, index) => (
                    <Badge key={index} variant="secondary" className="inline-flex justify-between gap-2 px-2 py-1">
                        <Clock size={16} />
                        {time}
                    </Badge>
                ))}
            </div>
        </div>
    )
}