-- Add image_url column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to post-images
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- Allow public read access to post images
CREATE POLICY "Public can view post images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[2]);
