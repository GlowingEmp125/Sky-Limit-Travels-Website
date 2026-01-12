"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Holiday {
  id?: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  imageUrl: string | null;
  featured: boolean;
  available: boolean;
}

interface HolidayFormProps {
  initialData?: Holiday;
  isEditing?: boolean;
}

const defaultHoliday: Holiday = {
  title: '',
  description: '',
  destination: '',
  duration: '',
  price: 0,
  imageUrl: null,
  featured: false,
  available: true,
};

export default function HolidayForm({ initialData, isEditing = false }: HolidayFormProps) {

  const router = useRouter();
  
  const [formData, setFormData] = useState<Holiday>(initialData || defaultHoliday);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(formData.imageUrl);
  
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      setUploadingImage(true);
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', imageFile);
      
      // Upload image
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update form data with image URL
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.imageUrl,
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // If there's a new image, upload it first
      if (imageFile) {
        const imageUrl = await handleImageUpload();
        if (!imageUrl) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create or update holiday
      const url = isEditing
        ? `/api/admin/holidays/${initialData?.id}`
        : '/api/admin/holidays';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save holiday');
      }
      
      // Redirect to holidays list
      router.push('/admin/holidays');
      router.refresh();
    } catch (err) {
      console.error('Error saving holiday:', err);
      setError('Failed to save holiday. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6  ">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Holidays
      </Button>
      
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit' : 'Add'} Holiday</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm mb-4">
                {error}
              </div>
            )}
            
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
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured">Featured</Label>
                      <div className="text-sm text-gray-500">
                        Highlight this holiday on the homepage
                      </div>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => 
                        handleSwitchChange('featured', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="available">Available</Label>
                      <div className="text-sm text-gray-500">
                        Show this holiday on the website
                      </div>
                    </div>
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => 
                        handleSwitchChange('available', checked)
                      }
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
                  <Label htmlFor="image">Holiday Image</Label>
                  <div className="mt-2 space-y-3">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Holiday preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Upload an image for this holiday
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
                        className="sr-only"
                      />
                      
                      {imageFile && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Now'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Holiday' : 'Create Holiday'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 