import * as React from "react"
import {Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {useAppStore} from "@/stores/slices/store";
import {SalesRevenueChartSkeleton} from "@/components/dashboard/sales-revenue-chart-skeleton";

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#B83E26",
    },
    bookings: {
        label: "Bookings",
        color: "#333333",
    },
} satisfies ChartConfig

export function SalesRevenueChart() {
    const {charts, isLoading} = useAppStore();

    // FIXED: Revenue কে Number রাখা হয়েছে, স্ট্রিং নয়
    const formattedData = React.useMemo(() => {
        if (!charts?.revenueByMonth?.labels || !charts?.revenueByMonth?.data) return [];

        return charts.revenueByMonth.labels.map((label, index) => ({
            month: label,
            revenue: charts.revenueByMonth.data[index] || 0, // শুধু সংখ্যা
            bookings: charts.bookingsByMonth?.data[index] || 0,
        }));
    }, [charts]);

    return (
        <>
            {
                isLoading ?
                    <SalesRevenueChartSkeleton/>
                    :
                    <Card className="pt-0 h-full border-none shadow-none lg:shadow-sm">
                        <CardHeader className="flex flex-col items-start gap-1 border-b py-5">
                            <CardTitle className="text-lg font-bold">Performance Analytics</CardTitle>
                            <CardDescription>
                                Revenue and Booking comparison for {charts?.revenueByMonth?.labels[0] || "2026"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-2 pt-6">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[380px] w-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={formattedData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4}/>
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            fontSize={12}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            fontSize={12}
                                            // ডলার সাইন এখানে দেখানো হচ্ছে
                                            tickFormatter={(value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`}
                                        />
                                        <ChartTooltip
                                            cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                            content={<ChartTooltipContent indicator="dashed"/>}
                                        />
                                        <ChartLegend content={<ChartLegendContent/>}/>

                                        <Bar
                                            dataKey="revenue"
                                            fill={chartConfig.revenue.color}
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                        />

                                        <Bar
                                            dataKey="bookings"
                                            fill={chartConfig.bookings.color}
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
            }
        </>

    )
}