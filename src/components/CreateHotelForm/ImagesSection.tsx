import { Controller, useFormContext } from "react-hook-form";
import { HotelFormData, SelectedImage } from ".";
import { RefObject, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  changeMultipleFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteSelectedImage: (imgId: number) => void;
  selectedImages: SelectedImage[];
  defaultSelectedImages: { id: string; url: string }[];
  deleteDefaultSelectedImage: (clickedImgId: string) => void;
}

const ImagesSection = ({
  changeMultipleFiles,
  deleteSelectedImage,
  selectedImages,
  defaultSelectedImages,
  deleteDefaultSelectedImage,
}: Props) => {
  const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement | null>(
    null
  );
  const {
    formState: { errors },
    control,
  } = useFormContext<HotelFormData>();

  const renderPreviewImages = () => {
    return (
      <div className="flex flex-wrap gap-4 mt-4">
        {selectedImages.map((img, index) => (
          <div
            key={img.id}
            className="w-36 h-36 border rounded overflow-hidden relative"
          >
            <img
              src={img.previewUrl}
              alt={`Preview ${index}`}
              className="object-cover w-full h-full z-0"
            />
            <div
              className="bg-red-500 p-[4px] rounded-full flex justify-center text-slate-200  
                z-20 absolute top-1 right-1 cursor-pointer opacity-0 hover:bg-red-600 hover:ring-1 hover:opacity-100"
              onClick={() => deleteSelectedImage(img.id)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDefaultPreviewImages = () => {
    return (
      <div className="flex flex-wrap gap-4 mt-4">
        {defaultSelectedImages.map((img) => (
          <div
            key={img.id}
            className="w-32 h-32 border rounded overflow-hidden relative"
          >
            <img
              src={img.url}
              alt={`Preview ${img.id}`}
              className="object-cover w-full h-full z-0"
            />
            <div
              className="bg-red-500 p-[4px] rounded-full flex justify-center text-slate-200  
                z-20 absolute top-1 right-1 cursor-pointer opacity-0 hover:bg-red-600 hover:ring-1 hover:opacity-100"
              onClick={() => deleteDefaultSelectedImage(img.id)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <Controller
          name="imageFiles"
          control={control}
          rules={{
            required: {
              value: defaultSelectedImages.length === 0,
              message: "At least one image should be selected",
            },
            maxLength: {
              value: 6,
              message: "Total number of images cannot be more than 6",
            },
          }}
          render={({ field: { name, onBlur } }) => (
            <>
              <input
                type="file"
                multiple
                ref={inputRef}
                name={name}
                onBlur={onBlur}
                onChange={changeMultipleFiles}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-[50%] mx-auto flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 
                  text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none 
                  focus:ring-2 focus:ring-blue-400"
              >
                <FontAwesomeIcon icon={faUpload} fontSize={"1.2rem"} />
                Upload Images
              </button>
              {errors.imageFiles && (
                <span className="text-red-500 text-sm font-bold text-center">
                  {errors.imageFiles.message}
                </span>
              )}
            </>
          )}
        />
        {defaultSelectedImages.length > 0 && renderDefaultPreviewImages()}
        {selectedImages.length > 0 && renderPreviewImages()}
      </div>
    </div>
  );
};

export default ImagesSection;
