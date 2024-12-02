import { Clock } from 'lucide-react'

import type { FocusTime } from "@/types/types"

export default function FocusTime({ statistics }: FocusTime) {
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${Math.round(mins)}m`
    }

    const dailyTime = () => {
        let totalDayTime: number = 0

        for (const day of statistics.daily) {
            totalDayTime += day.totalTime
        }

        const average = isNaN(totalDayTime / statistics.daily.length) ? 0 : totalDayTime / statistics.daily.length
        return formatTime(average)
    }

    const weeklyTime = () => {
        let totalWeekTime: number = 0

        for (const week of statistics.weekly) {
            totalWeekTime += week.totalTime
        }

        const average = isNaN(totalWeekTime / statistics.weekly.length) ? 0 : totalWeekTime / statistics.weekly.length
        return formatTime(average)
    }

    const monthlyTime = () => {
        let totalMonthTime: number = 0

        for (const month of statistics.monthly) {
            totalMonthTime += month.totalTime
        }

        const average = isNaN(totalMonthTime / statistics.monthly.length) ? 0 : totalMonthTime / statistics.monthly.length
        return formatTime(average)
    }

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Tempo Focado
            </h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                    <div className="font-medium">Diariamente</div>
                    <div>{dailyTime()}</div>
                </div>
                <div>
                    <div className="font-medium">Semanalmente</div>
                    <div>{weeklyTime()}</div>
                </div>
                <div>
                    <div className="font-medium">Mensalmente</div>
                    <div>{monthlyTime()}</div>
                </div>
            </div>
        </div>
    )
}