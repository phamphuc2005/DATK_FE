import axios from "axios";

export async function postRequest(url, body) {
  try {
    let response = await axios.post(process.env.REACT_APP_BASE_URL_LOCAL + url, body, generateRequestHeader());
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRequest(url) {
  try {
    let response = await axios.get(
      process.env.REACT_APP_BASE_URL_LOCAL + url,
      generateRequestHeader()
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function generateRequestHeader() {
  // const accessToken = localStorage.getItem("accessToken");
  // if (accessToken)
    return {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      },
    };
  // else return {
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  // }
}