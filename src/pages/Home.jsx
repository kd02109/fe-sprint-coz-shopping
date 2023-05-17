import Loading from "../components/Loading";
import styled from "styled-components";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import makeRandomNumber from "../util/makeRandomNumber";
import { useState } from "react";

const Main = styled.main`
  margin-top: 104px;
  margin-left: ${(props) => props.theme.margin.spacing11};
  margin-right: ${(props) => props.theme.margin.spacing11};
`;
const Title = styled.h2`
  font-size: ${(props) => props.theme.font.medium};
  font-weight: 600;
`;

const List = styled.ul`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

function Home({ handleClick, isLoading, setToast, setToastBookmark }) {
  // 화면 변경 표시 제거
  const state = useSelector((state) => state.bookmark);
  const [randomNumber, setrandomNumber] = useState(makeRandomNumber());
  return (
    <>
      <Main onClick={handleClick}>
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <section>
              <Title>상품 리스트</Title>
              <List>
                {state.slice(randomNumber, randomNumber + 4).map((item) => (
                  <li key={item.id}>
                    <Card
                      data={item}
                      setToast={setToast}
                      setToastBookmark={setToastBookmark}
                    />
                  </li>
                ))}
              </List>
            </section>
            <section>
              <Title>북마크 리스트</Title>
              <List>
                {state
                  .filter((item) => item.bookmarked)
                  .slice(0, 4)
                  .map((item) => (
                    <li key={item.id}>
                      <Card
                        data={item}
                        setToast={setToast}
                        setToastBookmark={setToastBookmark}
                      />
                    </li>
                  ))}
              </List>
            </section>
          </>
        )}
      </Main>
    </>
  );
}

export default Home;
