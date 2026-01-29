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
import { Info, Loader2, Mail, Phone, User } from "lucide-react";
import { ChangeEvent, FC, InputEvent, useState } from "react";
import ThankYouModal from "./thankyou-modal";
import { useRouter } from "next/navigation";

interface QuickCustomerBasicInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickCustomerBasicInfoModal: FC<QuickCustomerBasicInfoModalProps> = ({ open, onClose }) => {


  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [thankYouOpen, setThankYouOpen] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!data.phone) {
      errors.phone = 'Please enter your phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (!validateForm()) {
        return;
      }
      // Process form submission
      const { firstName, lastName, email, phone } = data;

      const payload = { firstName, lastName, email, phone }

      setIsSubmitting(true);
      setFormErrors({});


      const response = await fetch('/api/admin/enquiries', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit enquiry');

      handleClose();
      setThankYouOpen(true);

    } catch (err) {

      console.error('Error saving Destination:', err);

    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  }

  const handleClose = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    })
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
              First Name
            </label>
            <Input
              type="text"
              name="firstName"
              placeholder='Enter Full Name'
              className={`w-full h-12 bg-white border-gray-300 text-gray-900`}
              value={data.firstName}
              onChange={handleChange}
            />

          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Last Name
            </label>
            <Input
              type="text"
              name="lastName"
              placeholder='Enter Full Name'
              className={`w-full h-12 bg-white border-gray-300 text-gray-900`}
              value={data.lastName}
              onChange={handleChange}
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
              value={data.email}
              onChange={handleChange}
            />

          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              Phone No
            </label>
            <Input
              type="text"
              name="phone"
              placeholder='Enter Phone No'
              className={`w-full h-12 bg-white border-gray-300 text-gray-900
                           ${formErrors.phone ? 'border-red-500 focus:ring-red-200' : ''}
                          `}
              value={data.phone}
              onChange={handleChange}
            // onChange={(e) => setPhone(e.target.value)}
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
          <Button disabled={isSubmitting} onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ThankYouModal
        open={thankYouOpen}
        onClose={() => {
          setThankYouOpen(false);
          router.push("/");
        }}
      />
    </Dialog >
  )
}

export { QuickCustomerBasicInfoModal };