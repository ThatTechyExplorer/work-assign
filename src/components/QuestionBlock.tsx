import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Question } from "@/lib/worksheetService";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

interface QuestionBlockProps {
  index: number;
  value: Question;
  onChange: (value: Question) => void;
  onDelete: () => void;
}

const QuestionBlock = ({ index, value, onChange, onDelete }: QuestionBlockProps) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const imageRef = ref(storage, `questions/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      
      // Delete old image if exists
      if (value.imageUrl) {
        try {
          const oldImageRef = ref(storage, value.imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      onChange({ ...value, imageUrl: imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!value.imageUrl) return;

    try {
      setUploading(true);
      const imageRef = ref(storage, value.imageUrl);
      await deleteObject(imageRef);
      onChange({ ...value, imageUrl: undefined });
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-4 group">
      <div className="w-8 text-right text-gray-400 font-medium pt-2.5">{index}.</div>
      <div className="flex-1 space-y-3">
        <Textarea
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder="Enter your question..."
          className="min-h-[100px] resize-none border-gray-200 focus:border-worksheet-500 focus:ring-worksheet-500 text-gray-600 placeholder:text-gray-400"
        />
        
        {value.imageUrl ? (
          <div className="relative">
            <img 
              src={value.imageUrl} 
              alt={`Question ${index} image`}
              className="max-h-48 rounded-lg border border-gray-200"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteImage}
              disabled={uploading}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-gray-200 hover:bg-gray-50"
              disabled={uploading}
              onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  <span>Add Image</span>
                </>
              )}
            </Button>
            <input
              type="file"
              id={`image-upload-${index}`}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 self-start transition-opacity mt-2"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuestionBlock;