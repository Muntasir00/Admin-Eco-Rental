import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useAppStore} from "@/stores/slices/store";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    facilityId: string | null;
}

const DeleteFacilityDialog = ({open, onOpenChange, facilityId}: Props) => {
    const {removeFacility, isDeleting} = useAppStore();

    const handleDelete = async () => {
        if (facilityId) {
            await removeFacility(facilityId);
            onOpenChange(false);
            toast.success("Facility Deleted successfully.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the room.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        disabled={isDeleting}
                    >
                        {isDeleting && (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>)}
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteFacilityDialog;