import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
      # item {
      #   id
      # }
      # user {
      #   id
      # }
    }
  }
`;

class AddToCart extends Component {
  render() {
    const { id } = this.props;

    return (
      <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
        {addToCart => <button onClick={addToCart}>Add to cart 🛒</button>}
      </Mutation>
    );
  }
}

export default AddToCart;
