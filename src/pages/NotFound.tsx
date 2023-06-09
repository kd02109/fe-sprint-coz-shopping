import { isRouteErrorResponse } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import styled from "styled-components";

const ErrorDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: ${(props) => props.theme.title};
    margin-bottom: 20px;
    color: #e84118;
  }
  p {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

function NotFound() {
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }
  return (
    <ErrorDiv>
      <h1>404 Not Found</h1>
      <p>죄송합니다. 예상치 못한 에러가 발생했습니다.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </ErrorDiv>
  );
}

export default NotFound;
