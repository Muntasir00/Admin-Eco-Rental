import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import HotelVoucher from "@/components/bookings/invoice/hotel-voucher";

export default function DownloadInvoiceButton({ booking }: { booking: any }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <PDFDownloadLink
            document={<HotelVoucher booking={booking} />}
            fileName={`Invoice-${booking.name}-${booking._id.slice(-4)}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    disabled={loading}
                    title="Download Invoice"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                </Button>
            )}
        </PDFDownloadLink>
    );
}