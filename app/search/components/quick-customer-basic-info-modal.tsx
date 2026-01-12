"use client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info, Mail, Phone, User } from "lucide-react";
import { FC, useState } from "react";
import ThankYouModal from "./thankyou-modal";

interface QuickCustomerBasicInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickCustomerBasicInfoModal: FC<QuickCustomerBasicInfoModalProps> = ({ open, onClose }) => {

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [thankYouOpen, setThankYouOpen] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!phone) {
      errors.phone = 'Please enter your phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // Process form submission
    console.log({ name, email, phone });
    handleClose();
    setThankYouOpen(true);
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setFormErrors({});
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Quick Customer Basic Info </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Full Name
            </label>
            <Input
              type="text"
              placeholder='Enter Full Name'
              className={`w-full h-12 bg-white border-gray-300 text-gray-900`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Email
            </label>
            <Input
              type="email"
              placeholder='Enter Email'
              className={`w-full h-12 bg-white border-gray-300 text-gray-900`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              Phone No
            </label>
            <Input
              type="text"
              placeholder='Enter Phone No'
              className={`w-full h-12 bg-white border-gray-300 text-gray-900
                           ${formErrors.phone ? 'border-red-500 focus:ring-red-200' : ''}
                          `}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {formErrors.phone && (
              <div className="text-xs text-red-500 flex items-center mt-1">
                <Info className="w-3 h-3 mr-1" />
                {formErrors.phone}
              </div>
            )}

          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"  >Submit</Button>
        </DialogFooter>
      </DialogContent>
      <ThankYouModal
        open={thankYouOpen}
        onClose={() => setThankYouOpen(false)}
      />
    </Dialog >
  )
}

export { QuickCustomerBasicInfoModal };