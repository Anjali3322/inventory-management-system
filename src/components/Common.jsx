const Common = ({
  text, onClick,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${textColor} px-5 py-2 rounded-md font-medium hover:opacity-90 transition`}
    >
      {text}
    </button>
  );
};

export default Common;