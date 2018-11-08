import React from "react";
import PropTypes from "prop-types";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";

import calcToPrice from "../lib/calcTotalPrice";

import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends React.Component {
  totalItems(cart) {
    return cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
  }

  onToken(res, createOrder) {
    console.log(res);
    createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => alert(err.message));
  }

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={{ query: CURRENT_USER_QUERY }}
          >
            {createOrder => (
              <StripeCheckout
                amount={calcToPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${this.totalItems(me.cart)} items`}
                image={me.cart[0].item && me.cart[0].item.image}
                stripeKey="pk_test_QB2uGuuPPQhrdievgH3SEB6y"
                currency="GBP"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
