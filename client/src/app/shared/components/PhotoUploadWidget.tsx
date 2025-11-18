import { CloudUpload } from "@mui/icons-material";
import { Grid2, Box, Typography, Button } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type PreviewFile = File & { preview: string };

type Props = {
    uploadPhoto: (file: Blob) => void
    loading: boolean
}

const PhotoUploadWidget = ({uploadPhoto, loading} : Props) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const cropperRef = useRef<ReactCropperElement | null>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview))
    }
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file as Blob)
    })))
  }, []);

  const onCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    cropper?.getCroppedCanvas().toBlob(blob => {
        uploadPhoto(blob as Blob)
    })
  }, [uploadPhoto])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={4}>
        <Typography variant="overline" color="secondary">Step 1 - Add photo</Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "dashed 3px #eee",
            borderColor: isDragActive ? "green" : "#eee",
            borderRadius: "5px",
            paddingTop: "30px",
            textAlign: "center",
            height: "280px",
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 80 }} />
          <Typography variant="h5">Drop image here</Typography>
        </Box>
      </Grid2>

      <Grid2 size={4}>
        <Typography variant="overline" color="secondary">Step 2 - Resize image</Typography>
        {files.length > 0 && files[0]?.preview ? (
          <Cropper
            src={files[0].preview}
            style={{ height: 300, width: "90%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            background={false}
            ref={cropperRef}
          />
        ) : (
          <Typography variant="body2">No image selected</Typography>
        )}
      </Grid2>

      <Grid2 size={4}>
        {files[0]?.preview && (
            <>
                <Typography variant="overline" color="secondary">Step 3 - Preview & upload</Typography>
                <div 
                    className="img-preview"
                    style={{width: 300, height: 300, overflow: 'hidden'}}
                />
                <Button 
                    sx={{my: 1, width: 300}}
                    onClick={onCrop}
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                >
                    Upload
                </Button>
            </>
        )}
        
      </Grid2>
    </Grid2>
  );
};

export default PhotoUploadWidget;
