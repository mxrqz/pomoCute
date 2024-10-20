'use client'

import { ChartLineIcon } from "lucide-react";
import { Button } from "./ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useState } from "react";

interface PomodoroData {
    date: string,
    pomodoro: number
}

interface Datas {
    daily: PomodoroData[],
    weekly: PomodoroData[],
    monthly: PomodoroData[],
    yearly: PomodoroData[]
}

const datas: Datas = {
    daily: [
        { date: "Sunday", pomodoro: 10 },
        { date: "Monday", pomodoro: 12 },
        { date: "Tuesday", pomodoro: 6 },
        { date: "Wednesday", pomodoro: 7 },
        { date: "Thursday", pomodoro: 5 },
        { date: "Friday", pomodoro: 3 },
        { date: "Saturday", pomodoro: 9 },
    ],

    weekly: [
        { date: "Week 1", pomodoro: 10 },
        { date: "Week 2", pomodoro: 12 },
        { date: "Week 3", pomodoro: 5 },
        { date: "Week 4", pomodoro: 7 },
        { date: "Week 5", pomodoro: 3 },
        { date: "Week 6", pomodoro: 9 },
        { date: "Week 7", pomodoro: 6 },
    ],

    monthly: [
        { date: "January", pomodoro: 10 },
        { date: "Febraury", pomodoro: 12 },
        { date: "March", pomodoro: 5 },
        { date: "April", pomodoro: 7 },
        { date: "May", pomodoro: 3 },
        { date: "June", pomodoro: 9 },
        { date: "July", pomodoro: 6 },
    ],

    yearly: [
        { date: "2024", pomodoro: 10 },
        { date: "2025", pomodoro: 12 },
    ]
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function ChartLine() {
    const [chartData, setChartData] = useState<PomodoroData[]>(datas["daily" as keyof Datas])

    const changeChartData = (chart: string) => {
        setChartData(datas[chart as keyof Datas])
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size={"icon"}>
                    <ChartLineIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-foreground text-background dark:text-foreground dark:bg-background">
                <DialogTitle>Estastisticas de Pomodoro</DialogTitle>

                <Card className="bg-foreground text-background dark:text-foreground dark:bg-background border-none">
                    <CardHeader>
                        <CardDescription className="inline-flex">
                            <ToggleGroup type="single" defaultValue="daily" onValueChange={changeChartData}>
                                <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                                <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                                <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                                <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
                            </ToggleGroup>
                        </CardDescription>
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
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Line
                                    dataKey="pomodoro"
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