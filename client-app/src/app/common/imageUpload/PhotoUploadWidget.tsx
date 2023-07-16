import { useEffect, useState } from "react";
import { Button, Grid, Header, Image } from "semantic-ui-react";
import PhotoWidgetDropzone from "./photoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
// import { Cropper } from 'react-cropper';

export default function PhotoUploadWidget() {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => console.log(blob));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - add photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - resize image" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3 - preview & upload" />
        {files && files.length > 0 && (
          <>
            <div
              className="image-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            />
            <Button.Group widths={2}>
              <Button onClick={onCrop} positive icon="check" />
              <Button onClick={() => setFiles([])} icon="close" />
            </Button.Group>
          </>
        )}
      </Grid.Column>
      <Grid.Column width={1} />
    </Grid>
  );
}
