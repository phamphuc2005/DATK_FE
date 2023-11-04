
import './ErrorMessage.css';

export default function ErrorMessage({errorMessage, setErrorMesssage}) {
  const ExitErrorMessage = () => {
    setErrorMesssage(null);
  }

  return(
    <div className={errorMessage? "error-layer show" : "error-layer"}>
      <div className="error-box">
        <div className='error-icon'></div>
        <div className="message-title">Xin lỗi!</div>
        <div className='message-content'>{errorMessage}</div>
        <button onClick={ExitErrorMessage}>OK</button>
      </div>
    </div>
  )
}