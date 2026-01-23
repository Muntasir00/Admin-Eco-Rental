import {Card} from "@/components/ui/card";
import {LucideIcon, TrendingDown, TrendingUp} from "lucide-react";

type StatCardProps = {
    title: string;
    value: string | number;
    period: string;
    icon: LucideIcon;
    isDown?: boolean;
    type?: "primary" | "default";
};

const StatCard = ({
                      title,
                      value,
                      period,
                      icon: Icon,
                      isDown = false,
                      type = "default",
                  }: StatCardProps) => {
    const isPrimary = type === "primary";

    return (
        <Card
            className={
                isPrimary
                    ? "p-3 gap-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none"
                    : "p-3 gap-0"
            }
        >
            <div className="flex justify-between items-start mb-4">
                <h3
                    className={`font-medium ${
                        isPrimary ? "text-blue-100" : "text-gray-500"
                    }`}
                >
                    {title}
                </h3>

                <div
                    className={`p-2 rounded-lg ${
                        isPrimary ? "bg-white/20" : "bg-gray-100"
                    }`}
                >
                    <Icon
                        size={16}
                        className={isPrimary ? "text-white" : "text-gray-600"}
                    />
                </div>
            </div>

            <div className="text-3xl font-bold mb-2">{value}</div>

            <div className="flex items-center gap-2 text-sm flex-wrap">
                <span
                    className={`px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2  ${
                        isPrimary
                            ? "bg-white/20 text-white"
                            : isDown
                                ? "bg-red-100 text-red-500"
                                : "bg-cyan-100 text-cyan-600"
                    }`}
                >
                  {isDown ? <TrendingUp className="w-4"/> : <TrendingDown className="w-4"/>}
                </span>

                <span className={isPrimary ? "text-blue-100" : "text-gray-400"}>
                  {period}
                </span>
            </div>
        </Card>
    );
};

export default StatCard;
