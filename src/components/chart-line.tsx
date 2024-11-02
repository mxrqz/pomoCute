'use client'

import { useCallback, useEffect, useState } from "react";
import { format } from 'date-fns'

import { ChartLineIcon } from "lucide-react";
import { Button } from "./ui/button";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePomodoro } from "./PomodoroProvider"

// interface PomodoroData {
//     date: string,
//     pomodoro: number
// }

// interface Datas {
//     daily: PomodoroData[],
//     weekly: PomodoroData[],
//     monthly: PomodoroData[],
//     yearly: PomodoroData[]
// }

// const datas: Datas = {
//     daily: [
//         { date: "Sunday", pomodoro: 10 },
//         { date: "Monday", pomodoro: 12 },
//         { date: "Tuesday", pomodoro: 6 },
//         { date: "Wednesday", pomodoro: 7 },
//         { date: "Thursday", pomodoro: 5 },
//         { date: "Friday", pomodoro: 3 },
//         { date: "Saturday", pomodoro: 9 },
//     ],

//     weekly: [
//         { date: "Week 1", pomodoro: 10 },
//         { date: "Week 2", pomodoro: 12 },
//         { date: "Week 3", pomodoro: 5 },
//         { date: "Week 4", pomodoro: 7 },
//         { date: "Week 5", pomodoro: 3 },
//         { date: "Week 6", pomodoro: 9 },
//         { date: "Week 7", pomodoro: 6 },
//     ],

//     monthly: [
//         { date: "January", pomodoro: 10 },
//         { date: "Febraury", pomodoro: 12 },
//         { date: "March", pomodoro: 5 },
//         { date: "April", pomodoro: 7 },
//         { date: "May", pomodoro: 3 },
//         { date: "June", pomodoro: 9 },
//         { date: "July", pomodoro: 6 },
//     ],

//     yearly: [
//         { date: "2024", pomodoro: 10 },
//         { date: "2025", pomodoro: 12 },
//     ]
// }

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

interface PomodoroData {
    date: string;
    pomodoros: number;
}

interface Statistics {
    daily: PomodoroData[];       // Array com os últimos 7 dias
    weekly: PomodoroData[];      // Array com até 4 semanas
    monthly: PomodoroData[];     // Array com até 12 meses
    yearly: PomodoroData[];      // Armazena histórico de anos anteriores
}

const initialStatistics: Statistics = {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
};

export default function ChartLine() {
    const { selectedTimer, cycles } = usePomodoro()
    const [currentCycle, setCurrentCycle] = useState<number>(0)
    const [statistics, setStatistics] = useState<Statistics>(initialStatistics)
    const [chartData, setChartData] = useState<PomodoroData[]>()
    const [selectedChart, setSelectedChart] = useState<string>('daily')

    const updateWeeklyPomodoros = useCallback(() => {
        const currentWeek = format(new Date(), 'ww/yyyy');
        const existingWeek = statistics.weekly.find(week => week.date === currentWeek);

        if (existingWeek) {
            existingWeek.pomodoros += 1;
        } else {
            if (statistics.weekly.length >= 7) {
                statistics.weekly.shift();
            }
            statistics.weekly.push({ date: currentWeek, pomodoros: 1 });
        }
    }, [statistics.weekly])

    const updateMonthlyPomodoros = useCallback(() => {
        const currentMonth = format(new Date(), 'MMM/yyyy');
        const existingMonth = statistics.monthly.find(month => month.date === currentMonth);

        if (existingMonth) {
            existingMonth.pomodoros += 1;
        } else {
            if (statistics.monthly.length >= 12) {
                statistics.monthly.shift();
            }
            statistics.monthly.push({ date: currentMonth, pomodoros: 1 });
        }
    }, [statistics.monthly])

    const updateAnnualPomodoros = useCallback(() => {
        const currentYear = format(new Date(), 'yyyy');
        const existingYear = statistics.yearly.find(year => year.date === currentYear);

        if (existingYear) {
            existingYear.pomodoros += 1;
        } else {
            if (statistics.yearly.length >= 5) {
                statistics.yearly.shift();
            }
            statistics.yearly.push({ date: currentYear, pomodoros: 1 });
        }
    }, [statistics.yearly])

    const addDailyPomodoro = useCallback(() => {
        const today = format(new Date(), 'MM/dd/yyyy');
        const existingDay = statistics.daily.find(day => day.date === today);

        if (existingDay) {
            existingDay.pomodoros += 1;
        } else {
            if (statistics.daily.length >= 7) {
                statistics.daily.shift();
            }
            statistics.daily.push({ date: today, pomodoros: 1 });
        }

        updateWeeklyPomodoros();
        updateMonthlyPomodoros();
        updateAnnualPomodoros();

        localStorage.setItem('pomodoroStats', JSON.stringify(statistics))
    }, [statistics, updateAnnualPomodoros, updateMonthlyPomodoros, updateWeeklyPomodoros])

    useEffect(() => {
        const stats = localStorage.getItem('pomodoroStats')
        if (stats) {
            const statsParsed: Statistics = JSON.parse(stats)
            setStatistics(statsParsed)
            setChartData(statsParsed.daily)
        }
    }, [])

    useEffect(() => {
        if (currentCycle === selectedTimer.cycles) {
            addDailyPomodoro()
        }
    }, [addDailyPomodoro, currentCycle, selectedTimer.cycles])

    useEffect(() => {
        setCurrentCycle(cycles)
    }, [cycles, setCurrentCycle])

    const handleChartData = (value: string) => {
        setSelectedChart(value)
        switch (value) {
            case 'daily':
                setChartData(statistics.daily);
                break;
            case 'weekly':
                setChartData(statistics.weekly);
                break;
            case 'monthly':
                setChartData(statistics.monthly);
                break;
            case 'yearly':
                setChartData(statistics.yearly);
                break;
            default:
                setChartData(statistics.daily);
                break;
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size={"icon"} onClick={() => setChartData(statistics.daily)}>
                    <ChartLineIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-foreground text-background dark:text-foreground dark:bg-background">
                <DialogTitle>Estastisticas de Pomodoro</DialogTitle>

                <Card className="bg-foreground text-background dark:text-foreground dark:bg-background border-none">
                    <CardHeader className="inline-flex">
                        <ToggleGroup type="single" defaultValue="daily" onValueChange={handleChartData}>
                            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
                        </ToggleGroup>
                    </CardHeader>

                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 20,
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={true}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => {
                                        switch (selectedChart) {
                                            case "daily":
                                                return format(value, 'eee');
                                            case "weekly":
                                                // return format(value, 'w');
                                                return value
                                            case "monthly":
                                                return value
                                                // return format(value, 'MMM');
                                            case "yearly":
                                                return value
                                                // return format(value, 'y')
                                        }
                                        return value
                                    }}

                                    // daily: [],
                                    // weekly: [],
                                    // monthly: [],
                                    // yearly: [],
                                />
                                <ChartTooltip
                                    cursor={true}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Line
                                    dataKey="pomodoros"
                                    type="linear"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "var(--color-desktop)",
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                >
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                    />
                                </Line>
                            </LineChart>
                        </ChartContainer>
                    </CardContent>

                </Card>

                <DialogFooter>
                    Footer
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}