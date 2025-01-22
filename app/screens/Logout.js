import { useEffect } from "react";
import { useAppDispatch } from "shared/hooks/useRedux";
import { logout } from "store/slices/auth/authSlice";
import apiSlice from "shared/apis/apiSlice/apiSlice";

const Logout = () => {
  const dispatch = useAppDispatch();
  const loggingOut = async () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
  };

  useEffect(() => {
    loggingOut();
  }, []);
  return null;
};

export default Logout;
