import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";
import { FC } from "react";

interface ThankYouModalProps {
    open: boolean;
    onClose: () => void;
}
const ThankYouModal: FC<ThankYouModalProps> = ({ open, onClose }) => {
    
    return (
        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent className="sm:max-w-[450px] text-center">
                <DialogHeader>
                    <div className="flex justify-center items-center"> <ShieldCheck size={75} className="text-green-600" /></div>
                    <DialogTitle className="text-2xl font-semibold text-center">
                        Thank You!
                    </DialogTitle>

                    <p className="text-center">Our team will response as soon as possible</p>

                    <p className="text-center"> Your Details has been submitted successfully submitted.Thanks! </p>
                </DialogHeader>

                <DialogFooter className="flex justify-center mt-4">
                    <Button className="bg-green-600 text-white hover:bg-green-700 w-full" asChild>
                        <DialogTrigger>
                            OK
                        </DialogTrigger>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ThankYouModal;