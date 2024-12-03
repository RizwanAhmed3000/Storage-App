"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { calculatePercentage, convertFileSize } from "@/lib/utils"

const chartConfig = {
    size: {
        label: "Visitors",
    },
    Documents: {
        label: "Documents",
        color: "hsl(var(--chart-1))",
    },
    Images: {
        label: "Images",
        color: "hsl(var(--chart-2))",
    },
    Media: {
        label: "Media",
        color: "hsl(var(--chart-3))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const Chart = ({ totalSpace }: { totalSpace: any }) => {
    const { used, document, video, other, image } = totalSpace;

    // console.log(used, "====>>>> used")
    // console.log(calculatePercentage(used), "====>>>> calculatePercentage(used)")
    // console.log(convertFileSize(document.size), "====>>>> convertFileSize(used)")

    const chartData = [
        { type: "Documents ", size: document.size, fill: "#FA7275" },
        { type: "Images ", size: image.size, fill: "#56B8FF" },
        { type: "Media ", size: video.size, fill: "#3DD9B3" },
        { type: "other ", size: other.size, fill: "#EEA8FD" },
    ]

    return (
        <Card className="flex items-center justify-center ">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="size"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {
                                                        used === 0 ? "0%" : `${calculatePercentage(used).toString()}%`
                                                    }
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Space Used
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 h2 leading-none">
                    Available Storage
                </div>
                <div className="leading-none text-muted-foreground">
                    {used ? convertFileSize(used) : "2GB"} / 2GB
                </div>
            </CardFooter>
        </Card>
    )
}

export default Chart