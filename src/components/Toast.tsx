import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeToast } from "../states/toastSlice";
import { RootState } from "../states/reducer";

const Toast = () => {
  const toastState = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(closeToast());
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toastState.isShow]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-md z-50 shadow-md rounded-md p-4 text-white ${
        toastState.type === "SUCCESS" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{toastState.message}</span>
      </div>
    </div>
  );
};

export default Toast;
