"use client"

import type { PomodoroData } from "@/types/types";

import { useState } from "react";
import { format } from 'date-fns';

import { ChartLineIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { stats } from "@/functions/statsHandle";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function Stats() {
    const statistics = stats()

    const [chartData, setChartData] = useState<PomodoroData[]>()
    const [selectedChart, setSelectedChart] = useState<string>('daily')

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
                <Button variant="outline" size={"icon"} onClick={() => setChartData(statistics.daily)} aria-label="Visualizar estatísticas de pomodoros">
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
                    <DialogClose asChild>
                        <Button>Fechar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}