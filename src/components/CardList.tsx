import styled from "styled-components";
import Card from "./Card";
import { APIData } from "../api/api";

const Title = styled.h2`
  font-size: ${(props) => props.theme.font.medium};
  font-weight: 600;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  & > :not(:last-child) {
    margin-right: 20px;
  }
`;

interface CardListProp {
  state: APIData[];
  title?: string;
}

export default function CardList({ state, title }: CardListProp) {
  return (
    <section>
      {title && <Title>{title}</Title>}
      <List>
        {state.map((item) => (
          <li key={item.id}>
            <Card data={item} />
          </li>
        ))}
      </List>
    </section>
  );
}
