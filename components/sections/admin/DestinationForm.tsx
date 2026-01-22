// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Upload, Loader2, Calendar } from 'lucide-react';
// import Image from 'next/image';
// interface LandingPageDestination {
//   id?: string;
//   from: string;
//   destination: string;
//   duration: string;
//   price: number;
//   date: string; // ISO date string
//   stops: number;
//   destinationImage: string | null;
// }

// interface LandingPageTip {
//   id?: string;
//   title: string;
//   description: string;
// }

// interface Destination {
//   id?: string;
//   title: string;
//   description: string;
//   destination: string;
//   duration: string;
//   price: number;
//   slogan: string | null;
//   discountUpTo: number | null;
//   destinationImage: string | null;
//   featured: boolean;
//   available: boolean;
//   landingPageDestinations: LandingPageDestination[];
//   landingPageTips: LandingPageTip[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface DestinationFormProps {
//   initialData?: Destination;
//   isEditing?: boolean;
// }

// const defaultDestination: Destination = {
//   title: '',
//   description: '',
//   destination: '',
//   duration: '',
//   price: 0,
//   slogan: null,
//   discountUpTo: null,
//   destinationImage: null,
//   featured: false,
//   available: true,
//   landingPageDestinations: [],
//   landingPageTips: [],
// };

// const defaultLandingPageDestination: LandingPageDestination = {
//   from: '',
//   destination: '',
//   duration: '',
//   price: 0,
//   date: '',
//   stops: 1,
//   destinationImage: null,
// };

// const defaultLandingPageTip: LandingPageTip = {
//   title: '',
//   description: '',
// };
// export default function DestinationForm({ initialData, isEditing = false }: DestinationFormProps) {

//   const router = useRouter();

//   const [formData, setFormData] = useState<Destination>(initialData || defaultDestination);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [error, setError] = useState<string | null>(null);

//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const [imagePreview, setImagePreview] = useState<string | null>(formData.imageUrl);

//   const [uploadingImage, setUploadingImage] = useState(false);

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === 'price' ? parseFloat(value) : value,
//     }));
//   };

//   // Handle switch changes
//   const handleSwitchChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   // Handle image file selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);

//       // Create image preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async () => {
//     if (!imageFile) return;

//     try {
//       setUploadingImage(true);

//       // Create form data for upload
//       const formData = new FormData();
//       formData.append('file', imageFile);

//       // Upload image
//       const response = await fetch('/api/admin/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to upload image');
//       }

//       const data = await response.json();

//       // Update form data with image URL
//       setFormData((prev) => ({
//         ...prev,
//         destinationImage: data.imageUrl,
//       }));

//       return data.imageUrl;
//     } catch (err) {
//       console.error('Error uploading image:', err);
//       setError('Failed to upload image. Please try again.');
//       return null;
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // If there's a new image, upload it first
//       if (imageFile) {
//         const imageUrl = await handleImageUpload();
//         if (!imageUrl) {
//           setIsSubmitting(false);
//           return;
//         }
//       }

//       // Create or update Destination
//       const url = isEditing
//         ? `/api/admin/destination/${initialData?.id}`
//         : '/api/admin/destination';

//       const method = isEditing ? 'PUT' : 'POST';

//       console.log("formData==========>", formData);

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save Destination');
//       }

//       // Redirect to Destinations list
//       router.push('/admin/destinations');
//       router.refresh();
//     } catch (err) {
//       console.error('Error saving Destination:', err);
//       setError('Failed to save Destination. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 ">
//       <Button
//         variant="ghost"
//         className="mb-6"
//         onClick={() => router.back()}
//       >
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back to Destinations
//       </Button>

//       <Card className="bg-white">
//         <CardHeader>
//           <CardTitle>{isEditing ? 'Edit' : 'Add'} Destination</CardTitle>
//         </CardHeader>

//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-6">
//             {error && (
//               <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm mb-4">
//                 {error}
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <div>
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="destination">Destination</Label>
//                   <Input
//                     id="destination"
//                     name="destination"
//                     value={formData.destination}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="duration">Duration</Label>
//                     <Input
//                       id="duration"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleChange}
//                       placeholder="e.g. 7 nights"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="price">Price (£)</Label>
//                     <Input
//                       id="price"
//                       name="price"
//                       type="number"
//                       value={formData.price}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="slogan">Slogan</Label>
//                     <Input
//                       id="slogan"
//                       name="slogan"
//                       type="text"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="slogan">Discount upto (%)</Label>
//                     <Input
//                       id="discount"
//                       name="discount"
//                       type="text"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label htmlFor="featured">Featured</Label>
//                       <div className="text-sm text-gray-500">
//                         Highlight this Destination on the homepage
//                       </div>
//                     </div>
//                     <Switch
//                       id="featured"
//                       checked={formData.featured}
//                       onCheckedChange={(checked) =>
//                         handleSwitchChange('featured', checked)
//                       }
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label htmlFor="available">Available</Label>
//                       <div className="text-sm text-gray-500">
//                         Show this Destination on the website
//                       </div>
//                     </div>
//                     <Switch
//                       id="available"
//                       checked={formData.available}
//                       onCheckedChange={(checked) =>
//                         handleSwitchChange('available', checked)
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="min-h-[120px]"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="image">Destination Image</Label>
//                   <div className="mt-2 space-y-3">
//                     {imagePreview ? (
//                       <div className="relative w-full aspect-video rounded-md overflow-hidden">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                           src={imagePreview}
//                           alt="Destination preview"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     ) : (
//                       <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
//                         <Upload className="w-8 h-8 mx-auto text-gray-400" />
//                         <p className="mt-2 text-sm text-gray-500">
//                           Upload an image for this Destination
//                         </p>
//                       </div>
//                     )}

//                     <div className="flex items-center gap-2">
//                       <Label
//                         htmlFor="image-upload"
//                         className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
//                       >
//                         {imagePreview ? 'Change Image' : 'Upload Image'}
//                       </Label>
//                       <Input
//                         id="image-upload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="sr-only hidden"
//                       />

//                       {imageFile && (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={handleImageUpload}
//                           disabled={uploadingImage}
//                         >
//                           {uploadingImage ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Uploading...
//                             </>
//                           ) : (
//                             'Upload Now'
//                           )}
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <p className='text-md '>Add Landing Page Destination</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <div>
//                   <Label htmlFor="from">from</Label>
//                   <Input
//                     id="from"
//                     name="from"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="destination">Destination</Label>
//                   <Input
//                     id="destination"
//                     name="destination"
//                     value={formData.destination}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="duration">Duration</Label>
//                     <Input
//                       id="duration"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleChange}
//                       placeholder="e.g. 7 nights"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label htmlFor="price">Price (£)</Label>
//                     <Input
//                       id="price"
//                       name="price"
//                       type="number"
//                       value={formData.price}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       required
//                     />
//                   </div>




//                 </div>
//                 <div className='grid grid-cols-2 gap-4'>

//                   <div >
//                     <label className="text-sm font-medium text-gray-700 flex items-center">
//                       <Calendar className="w-4 h-4 mr-2 text-blue-600" />
//                       Date
//                     </label>
//                     <Input
//                       type="date"
//                       className={`w-full h-12 bg-white border-gray-300 text-gray-900 
                      
//                       }`}
//                     />
//                   </div>

//                   <div >
//                     <label className="text-sm font-medium text-gray-700">
//                       Stops
//                     </label>
//                     <select
//                       className="w-full h-12 bg-white border border-gray-300 rounded-md px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
//                         <option key={num} value={num}>{num}</option>
//                       ))}
//                     </select>
//                   </div>

//                 </div>

//               </div>

//               <div className="space-y-3">

//                 <div>
//                   <Label htmlFor="image">Destination Image</Label>
//                   <div className="mt-2 space-y-3">
//                     {imagePreview ? (
//                       <div className="relative w-full aspect-video rounded-md overflow-hidden">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img
//                           src={imagePreview}
//                           alt="Destination preview"
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     ) : (
//                       <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
//                         <Upload className="w-8 h-8 mx-auto text-gray-400" />
//                         <p className="mt-2 text-sm text-gray-500">
//                           Upload an image for this Destination
//                         </p>
//                       </div>
//                     )}

//                     <div className="flex items-center gap-2">
//                       <Label
//                         htmlFor="image-upload"
//                         className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
//                       >
//                         {imagePreview ? 'Change Image' : 'Upload Image'}
//                       </Label>
//                       <Input
//                         id="image-upload"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="sr-only hidden"
//                       />

//                       {imageFile && (
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={handleImageUpload}
//                           disabled={uploadingImage}
//                         >
//                           {uploadingImage ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Uploading...
//                             </>
//                           ) : (
//                             'Upload Now'
//                           )}
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <p className='text-md '>Add Landing Page Tip and Advice</p>

//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="min-h-[120px]"
//                 required
//               />
//             </div>
//           </CardContent>

//           <CardFooter className="flex justify-between">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.back()}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   {isEditing ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 isEditing ? 'Update Destination' : 'Create Destination'
//               )}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// } 

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2, Calendar, Plus, Trash2 } from 'lucide-react';

interface LandingPageDestination {
  id?: string;
  from: string;
  destination: string;
  duration: string;
  price: number;
  date: string;
  stops: number;
  destinationImage: string | null;
}

interface LandingPageTip {
  id?: string;
  title: string;
  description: string;
}

interface Destination {
  id?: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  slogan: string | null;
  discountUpTo: number | null;
  destinationImage: string | null;
  featured: boolean;
  available: boolean;
  landingPageDestinations: LandingPageDestination[];
  landingPageTips: LandingPageTip[];
  createdAt?: string;
  updatedAt?: string;
}

interface DestinationFormProps {
  initialData?: Destination;
  isEditing?: boolean;
}

const defaultDestination: Destination = {
  title: '',
  description: '',
  destination: '',
  duration: '',
  price: 0,
  slogan: null,
  discountUpTo: null,
  destinationImage: null,
  featured: false,
  available: true,
  landingPageDestinations: [],
  landingPageTips: [],
};

const defaultLandingPageDestination: LandingPageDestination = {
  from: '',
  destination: '',
  duration: '',
  price: 0,
  date: '',
  stops: 1,
  destinationImage: null,
};

const defaultLandingPageTip: LandingPageTip = {
  title: '',
  description: '',
};

export default function DestinationForm({ initialData, isEditing = false }: DestinationFormProps) {

  const router = useRouter();
  
  const [formData, setFormData] = useState<Destination>(initialData || defaultDestination);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  // Main destination image
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(formData.destinationImage);
  
  const [uploadingImage, setUploadingImage] = useState(false);

  // Landing page destination images (array indexed)
  const [lpImageFiles, setLpImageFiles] = useState<{ [key: number]: File }>({});
  
  const [lpImagePreviews, setLpImagePreviews] = useState<{ [key: number]: string }>({});
  
  const [uploadingLpImages, setUploadingLpImages] = useState<{ [key: number]: boolean }>({});

  // Handle main form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'discountUpTo' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle main destination image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        destinationImage: data.imageUrl,
      }));

      return data.imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Landing Page Destination handlers
  const addLandingPageDestination = () => {
    setFormData((prev) => ({
      ...prev,
      landingPageDestinations: [...prev.landingPageDestinations, { ...defaultLandingPageDestination }],
    }));
  };

  const removeLandingPageDestination = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      landingPageDestinations: prev.landingPageDestinations.filter((_, i) => i !== index),
    }));
  };

  const handleLpDestinationChange = (index: number, field: keyof LandingPageDestination, value: any) => {
    setFormData((prev) => ({
      ...prev,
      landingPageDestinations: prev.landingPageDestinations.map((item, i) =>
        i === index ? { ...item, [field]: field === 'price' || field === 'stops' ? parseFloat(value) || 0 : value } : item
      ),
    }));
  };

  const handleLpImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLpImageFiles((prev) => ({ ...prev, [index]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLpImagePreviews((prev) => ({ ...prev, [index]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLpImageUpload = async (index: number) => {
    const file = lpImageFiles[index];
    if (!file) return null;

    try {
      setUploadingLpImages((prev) => ({ ...prev, [index]: true }));
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();

      handleLpDestinationChange(index, 'destinationImage', data.imageUrl);
      return data.imageUrl;
    } catch (err) {
      console.error('Error uploading landing page image:', err);
      setError('Failed to upload landing page image. Please try again.');
      return null;
    } finally {
      setUploadingLpImages((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Landing Page Tips handlers
  const addLandingPageTip = () => {
    setFormData((prev) => ({
      ...prev,
      landingPageTips: [...prev.landingPageTips, { ...defaultLandingPageTip }],
    }));
  };

  const removeLandingPageTip = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      landingPageTips: prev.landingPageTips.filter((_, i) => i !== index),
    }));
  };

  const handleTipChange = (index: number, field: keyof LandingPageTip, value: string) => {
    setFormData((prev) => ({
      ...prev,
      landingPageTips: prev.landingPageTips.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload main image if exists
      if (imageFile) {
        await handleImageUpload();
      }

      // Upload all landing page images
      for (let i = 0; i < formData.landingPageDestinations.length; i++) {
        if (lpImageFiles[i]) {
          await handleLpImageUpload(i);
        }
      }

      const url = isEditing
        ? `/api/admin/destination/${initialData?.id}`
        : '/api/admin/destination';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save Destination');

      router.push('/admin/destinations');
      router.refresh();
    } catch (err) {
      console.error('Error saving Destination:', err);
      setError('Failed to save Destination. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Destinations
      </Button>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit' : 'Add'} Destination</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {error && (
              <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Main Destination Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Main Destination Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 7 nights"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price (£)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        // min="0"
                        // step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="slogan">Slogan</Label>
                      <Input
                        id="slogan"
                        name="slogan"
                        value={formData.slogan || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountUpTo">Discount up to (%)</Label>
                      <Input
                        id="discountUpTo"
                        name="discountUpTo"
                        type="number"
                        value={formData.discountUpTo || ''}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        // step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="featured">Featured</Label>
                        <div className="text-sm text-gray-500">
                          Highlight this Destination on the homepage
                        </div>
                      </div>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="available">Available</Label>
                        <div className="text-sm text-gray-500">
                          Show this Destination on the website
                        </div>
                      </div>
                      <Switch
                        id="available"
                        checked={formData.available}
                        onCheckedChange={(checked) => handleSwitchChange('available', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Destination Image</Label>
                    <div className="mt-2 space-y-3">
                      {imagePreview ? (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Destination preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Upload an image for this Destination
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="image-upload"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                          {imagePreview ? 'Change Image' : 'Upload Image'}
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Landing Page Destinations Section */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Landing Page Destinations</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLandingPageDestination}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Button>
              </div>

              {formData.landingPageDestinations.map((lpDest, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Destination #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLandingPageDestination(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label>From</Label>
                        <Input
                          value={lpDest.from}
                          onChange={(e) => handleLpDestinationChange(index, 'from', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label>Destination</Label>
                        <Input
                          value={lpDest.destination}
                          onChange={(e) => handleLpDestinationChange(index, 'destination', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={lpDest.duration}
                            onChange={(e) => handleLpDestinationChange(index, 'duration', e.target.value)}
                            placeholder="e.g. 7 nights"
                            required
                          />
                        </div>

                        <div>
                          <Label>Price (£)</Label>
                          <Input
                            type="number"
                            value={lpDest.price}
                            onChange={(e) => handleLpDestinationChange(index, 'price', e.target.value)}
                            min="0"
                            // step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            Date
                          </Label>
                          <Input
                            type="date"
                            value={lpDest.date}
                            onChange={(e) => handleLpDestinationChange(index, 'date', e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label>Stops</Label>
                          <select
                            className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-gray-900"
                            value={lpDest.stops}
                            onChange={(e) => handleLpDestinationChange(index, 'stops', e.target.value)}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Destination Image</Label>
                      <div className="mt-2 space-y-3">
                        {(lpImagePreviews[index] || lpDest.destinationImage) ? (
                          <div className="relative w-full aspect-video rounded-md overflow-hidden">
                            <img
                              src={lpImagePreviews[index] || lpDest.destinationImage || ''}
                              alt="Landing page destination preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
                            <Upload className="w-6 h-6 mx-auto text-gray-400" />
                            <p className="mt-2 text-xs text-gray-500">Upload image</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`lp-image-${index}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          >
                            {lpImagePreviews[index] || lpDest.destinationImage ? 'Change' : 'Upload'}
                          </Label>
                          <Input
                            id={`lp-image-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLpImageChange(index, e)}
                            className="sr-only hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Landing Page Tips Section */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Landing Page Tips and Advice</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLandingPageTip}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tip
                </Button>
              </div>

              {formData.landingPageTips.map((tip, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Tip #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLandingPageTip(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={tip.title}
                        onChange={(e) => handleTipChange(index, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={tip.description}
                        onChange={(e) => handleTipChange(index, 'description', e.target.value)}
                        className="min-h-[80px]"
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Destination' : 'Create Destination'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}