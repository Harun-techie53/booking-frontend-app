import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { apiPost, apiPut } from "../../helpers/axios/config";
import { useDispatch } from "react-redux";
import { showToast } from "../../states/toastSlice";
import { useEffect, useState } from "react";
import { IMyHotel } from "../../types/interfaces";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  adultCount: number;
  childCount: number;
};

export type SelectedImage = {
  id: number;
  previewUrl: string;
  file: File;
};

export enum FormMode {
  EDIT = "EDIT",
  CREATE = "CREATE",
}

interface Props {
  hotel?: IMyHotel;
  isFetchHotelLoading?: boolean;
  formMode: FormMode;
}

const CreateHotelForm = ({ hotel, formMode }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const formMethods = useForm<HotelFormData>();

  const { formState } = formMethods;

  const [defaultSelectedImages, setDefaultSelectedImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [deleteDefaultImageIds, setDeleteDefaultImageIds] = useState<string[]>(
    []
  );
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const changeMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFiles: SelectedImage[] = Array.from(
      e.target.files as FileList
    ).map((file, idx) => ({
      id: idx,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages(imageFiles);
    formMethods.setValue("imageFiles", e.target.files as FileList);
  };

  const deleteSelectedImage = (clickedImgId: number) => {
    // Filter out the clicked image
    const remainingImageFiles = selectedImages.filter(
      (img) => img.id !== clickedImgId
    );

    setSelectedImages((prevState) =>
      prevState.filter((img) => img.id !== clickedImgId)
    );

    // Convert remaining images back to FileList
    const dataTransfer = new DataTransfer();
    remainingImageFiles.forEach((fileObj) => {
      dataTransfer.items.add(fileObj.file as File);
    });

    formMethods.setValue("imageFiles", dataTransfer.files);
  };

  const deleteDefaultSelectedImage = (clickedImgId: string) => {
    setDeleteDefaultImageIds((prev) => {
      if (prev.includes(clickedImgId)) {
        return prev;
      }

      return [...prev, clickedImgId];
    });
    setDefaultSelectedImages((prev) =>
      prev.filter((img) => img.id !== clickedImgId)
    );
  };

  const formSubmit: SubmitHandler<HotelFormData> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name.toString());
    formData.append("city", data.city.toString());
    formData.append("country", data.country.toString());
    formData.append("description", data.description.toString());
    formData.append("type", data.type.toString());
    formData.append("pricePerNight", data.pricePerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adultCount", data.adultCount.toString());
    formData.append("childCount", data.childCount.toString());

    // Append each facility separately
    data.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // Append each image file separately
    Array.from(data.imageFiles).forEach((file) => {
      formData.append(`imageFiles`, file);
    });

    setIsLoading(true);
    const response = await apiPost({
      apiPath: "/my-hotels",
      data: formData,
      withCredentials: true,
      isMultipart: true,
    });
    setIsLoading(false);

    if (response.status === "success") {
      dispatch(
        showToast({ message: response.message, type: "SUCCESS", isShow: true })
      );
    } else {
      dispatch(
        showToast({
          message: response.errorMessage,
          type: "ERROR",
          isShow: true,
        })
      );
    }

    setSelectedImages([]);

    formMethods.reset();
  };

  const editFormSubmit: SubmitHandler<HotelFormData> = async (data: {
    [key: string]: any;
  }) => {
    const formData = new FormData();
    Object.keys(formState.dirtyFields).forEach((key) => {
      if (key === "facilities") {
        data[key].forEach((facility: string, index: number) => {
          formData.append(`facilities[${index}]`, facility);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    if (
      data.imageFiles !== undefined &&
      Array.from(data.imageFiles).length > 0
    ) {
      Array.from(data.imageFiles).forEach((file) => {
        formData.append(`imageFiles`, file as File);
      });
    }

    if (deleteDefaultImageIds.length > 0) {
      deleteDefaultImageIds.forEach((id, index) =>
        formData.append(`deleteCloudinaryImageIds[${index}]`, id)
      );
    }

    let formDataLength = 0;
    for (const _ of formData) {
      formDataLength++;
    }

    if (hotel && formDataLength > 0) {
      setIsLoading(true);
      const response = await apiPut({
        apiPath: `/my-hotels/${hotel?._id}`,
        data: formData,
        withCredentials: true,
        isMultipart: true,
      });
      setIsLoading(false);

      if (response.status === "success") {
        dispatch(
          showToast({
            message: response.message,
            type: "SUCCESS",
            isShow: true,
          })
        );

        formMethods.reset(response.data.hotel);
      } else {
        dispatch(
          showToast({
            message: response.errorMessage,
            type: "ERROR",
            isShow: true,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (hotel) {
      setDefaultSelectedImages(
        hotel.imageUrls.map((img) => ({
          id: img.public_id.toString(),
          url: img.url.toString(),
        }))
      );
    } else {
      setDefaultSelectedImages([]);
    }
  }, [hotel]);

  useEffect(() => {
    formMethods.reset(hotel as IMyHotel);
  }, [hotel, formMethods.reset]);

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col gap-10"
        onSubmit={
          hotel
            ? formMethods.handleSubmit(editFormSubmit)
            : formMethods.handleSubmit(formSubmit)
        }
        encType="multipart/form-data"
      >
        <DetailsSection formMode={formMode} />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection
          changeMultipleFiles={changeMultipleFiles}
          deleteSelectedImage={deleteSelectedImage}
          selectedImages={selectedImages}
          defaultSelectedImages={defaultSelectedImages}
          deleteDefaultSelectedImage={deleteDefaultSelectedImage}
        />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default CreateHotelForm;
