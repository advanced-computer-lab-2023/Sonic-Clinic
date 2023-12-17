import { useNavigate } from "react-router-dom";
import "../forms.css";

const PasswordChangedForm = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="col-9 form-container">
      <div
        className="form-title"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontWeight: 600,
          fontSize: "2rem",
        }}
      >
        Password Changed!
      </div>
      <div className="Description">
        <div className="changedPasswordDescription">
          <h6 style={{ fontSize: "14px", color: "gray", marginBottom: "3rem" }}>
            Your exploration will start now
          </h6>
        </div>
      </div>
      <button
        className="w-100 btn-sm custom-button"
        type="submit"
        onClick={handleClick}
      >
        Back to Login
      </button>
    </div>
  );
};
export default PasswordChangedForm;
