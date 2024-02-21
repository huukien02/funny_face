import { useId, useRef, useState } from "react";
import { toast } from "react-toastify";

import useLoading from "../../../hooks/useLoading";
import useProfile from "../../../hooks/useProfile";
import { changeAvatar, uploadImg } from "../../../services/user.service";

const MAX_FILE_SIZE = 10485760;

function EditModal({ openEditModal, setOpenEditModal, user }) {
  const [username, setUsername] = useState(user.user_name);
  const [avatarTemp, setAvatarTemp] = useState(null);
  const [file, setFile] = useState(null);

  const labelRef = useRef();
  const inputId = useId();

  const { setIsLoading } = useLoading();
  const { updateProfileAvatar } = useProfile();

  const handleInputChange = async (e) => {
    setIsLoading(true);
    try {
      const fileTarget = e.target.files[0];

      if (fileTarget.size > MAX_FILE_SIZE)
        throw new Error("Max file size is 10MB");

      setAvatarTemp(URL.createObjectURL(fileTarget));
      setFile(fileTarget);
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!username || !username.trim()) throw new Error("Empty user's name");

      if (!file) throw new Error("Avatar not found");

      if (file.size > MAX_FILE_SIZE) throw new Error("Max file size is 10MB");

      const formData = new FormData();
      formData.append("src_img", file);

      const uploadResponse = await uploadImg(formData);
      const imgUploadSrc = uploadResponse.data;

      if (imgUploadSrc?.message) throw new Error(imgUploadSrc.message);

      formData.append("link_img", imgUploadSrc);
      formData.append("check_img", "upload");

      const response = await changeAvatar(user.id_user, formData);

      if (!response) throw new Error("Change avatar fail");

      const avatarUrl = response.data.link_img;
      updateProfileAvatar(avatarUrl);
      toast.success("Updated successfully!");
      setOpenEditModal(false);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
    setIsLoading(false);
  };

  if (!openEditModal) return null;

  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => setOpenEditModal(false)}
    >
      <div
        className="relative flex flex-col items-center gap-10 px-10 py-8 bg-modal-gray rounded-xl font-[Quicksand]"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor={inputId} ref={labelRef} className="hidden" />
        <input
          id={inputId}
          className="hidden"
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
        />
        <div
          className="flex justify-center items-center text-2xl bg-white rounded-full text-black cursor-pointer absolute top-6 right-6 px-3 py-2"
          onClick={() => setOpenEditModal(false)}
        >
          x
        </div>
        <span className="text-3xl text-white font-semibold">Profile</span>
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden">
            <img
              src={avatarTemp || user.link_avatar}
              alt="Avatar"
              className="w-full h-full bg-cover"
            />
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full min-w-[30vw] border-none outline-none p-3 bg-gray-400 rounded-md text-3xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-white text-black rounded-md p-3 text-2xl"
                onClick={() => labelRef.current?.click()}
              >
                Upload image
              </button>
              <button
                className="bg-green-400 text-white rounded-md p-3 text-2xl"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
