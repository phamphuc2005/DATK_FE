// import { useEffect } from "react"
// import styled from "styled-components"

function NotFound() {

  return(
    <div className="white-box-page">
      <div className="box-title">404 - Không tìm thấy trang</div>
      <p className="box-text">{window.location.pathname} không tồn tại</p>
    </div>
  )
}

export default NotFound