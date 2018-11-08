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

class TakeMyMoney extends React.Component {
  totalItems(cart) {
    return cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
  }

  onToken(res) {
    console.log(res);
  }

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcToPrice(me.cart)}
            name="Sick Fits"
            description={`Order of ${this.totalItems(me.cart)} items`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_QB2uGuuPPQhrdievgH3SEB6y"
            currency="GBP"
            email={me.email}
            token={this.onToken}
          >
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

TakeMyMoney.propTypes = {};

export default TakeMyMoney;
