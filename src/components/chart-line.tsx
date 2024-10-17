'use client'

import { ChartLineIcon } from "lucide-react";
import { Button } from "./ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
// import { useState } from "react";

interface ChartData {
    date: string,
    pomodoro: number
}

const dailyData = [
    { date: "Sunday", pomodoro: 186 },
    { date: "Monday", pomodoro: 305 },
    { date: "Tursday", pomodoro: 237 },
    { date: "Wednesday", pomodoro: 73 },
    { date: "Friday", pomodoro: 209 },
    { date: "Saturday", pomodoro: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function ChartLine() {
    // const [chartData, setChartData] = useState<ChartData[]>(dailyData)
    const chartData: ChartData[] = dailyData

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size={"icon"}>
                    <ChartLineIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-foreground text-background dark:text-foreground dark:bg-background">
                <Card className="bg-foreground text-background dark:text-foreground dark:bg-background">
                    <CardHeader>
                        <CardTitle>Estastisticas de Pomodoro</CardTitle>
                        <CardDescription className="inline-flex">
                            <ToggleGroup type="single" defaultValue="daily">
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
                                    dataKey="month"
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
                                    dataKey="desktop"
                                    type="natural"
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
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div>footer</div>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

// "use client"

// import { TrendingUp } from "lucide-react"
// import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// export const description = "A line chart with a label"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig

// export function Component() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Line Chart - Label</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <LineChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               top: 20,
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="line" />}
//             />
//             <Line
//               dataKey="desktop"
//               type="natural"
//               stroke="var(--color-desktop)"
//               strokeWidth={2}
//               dot={{
//                 fill: "var(--color-desktop)",
//               }}
//               activeDot={{
//                 r: 6,
//               }}
//             >
//               <LabelList
//                 position="top"
//                 offset={12}
//                 className="fill-foreground"
//                 fontSize={12}
//               />
//             </Line>
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }
