import {Card} from "@/components/ui/card";
import {MoreHorizontal, TrendingDown, TrendingUp} from "lucide-react";

type MetricCardProps = {
    title: string;
    value: string | number;
    change?: string;
    isUp?: boolean;
    sub1?: string;
    sub2?: string;
    onMoreClick?: () => void;
};

const MetricCard = ({
                        title,
                        value,
                        change = "0%",
                        isUp = true,
                        sub1,
                        sub2,
                        onMoreClick,
                    }: MetricCardProps) => {
    return (
        <Card className="flex flex-col p-5 gap-0 justify-between h-full py-6">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{title}</h3>

                <MoreHorizontal
                    size={20}
                    className="text-gray-400 cursor-pointer"
                    onClick={onMoreClick}
                />
            </div>

            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">{value}</span>

                <span
                    className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                        isUp
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                    }`}
                >
                  {isUp ? <TrendingUp className="w-4"/> : <TrendingDown className="w-4"/>} {change}
                </span>
            </div>

            <div className="flex justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                <span>{sub1}</span>
                <span>{sub2}</span>
            </div>
        </Card>
    );
};

export default MetricCard;
