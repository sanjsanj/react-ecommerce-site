import React, { Component } from "react";
import { adopt } from "react-adopt";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";

import OrderStyles from "./styles/OrderStyles";

import formatMoney from "../lib/formatMoney";

import Error from "./ErrorMessage";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      createdAt
      total
      user {
        id
      }
      items {
        id
        title
        description
        image
        largeImage
        price
        quantity
      }
    }
  }
`;

const Composed = adopt({
  orderQuery: ({ id, render }) => (
    <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
      {render}
    </Query>
  )
});

class Order extends Component {
  static proprTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <Composed id={this.props.id}>
        {({ orderQuery }) => {
          if (orderQuery.error) return <Error error={orderQuery.error} />;

          if (orderQuery.loading) return <p>Loading...</p>;

          const order = orderQuery.data.order;

          return (
            <OrderStyles data-test="order">
              <Head>
                <title>Sick Fits - Order {order.id}</title>
              </Head>
              <p>
                <span>Order ID:</span>
                <span>{this.props.id}</span>
              </p>
              <p>
                <span>Charge</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date</span>
                <span>{format(order.createdAt, "MMMM d, YYYY h:mm a")}</span>
              </p>
              <p>
                <span>Order Total</span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Item Count</span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map(item => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          );
        }}
      </Composed>
    );
  }
}

export default Order;
