import CreateHotelForm, { FormMode } from "../components/CreateHotelForm";

const CreateHotel = () => {
  return (
    <>
      <CreateHotelForm formMode={FormMode["CREATE"]} />
    </>
  );
};

export default CreateHotel;
