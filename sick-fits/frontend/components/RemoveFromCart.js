import React, { Component } from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";

const REMOVE_CART_ITEM_MUTATION = gql`
  mutation REMOVE_CART_ITEM_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    const cartItemId = payload.data.removeFromCart.id;

    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);

    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };

  render() {
    const { id } = this.props;

    return (
      <Mutation
        mutation={REMOVE_CART_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typename: "CartItem",
            id: id
          }
        }}
      >
        {(removeFromCart, { loading, error }) => (
          <BigButton
            title="Delete item"
            disabled={loading}
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
