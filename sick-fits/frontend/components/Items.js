import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import Pagination from "./Pagination";
import Item from "./Item";

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
          <Query query={ALL_ITEMS_QUERY}>
            {({ data, error, loading }) => {
              if (error) return <p>Error: {error.message}</p>;
              if (loading) return <p>Loading...</p>;
              return (
                <ItemsList>
                  {data.items.map(item => (
                    <Item key={item.id} item={item} />
                  ))}
                </ItemsList>
              );
            }}
          </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

export { ALL_ITEMS_QUERY };
export default Items;
