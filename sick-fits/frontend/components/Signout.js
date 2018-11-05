import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const handleConfirm = fn => {
  if (window.confirm("Are you sure you want to sign out?")) fn();
};

const Signout = () => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => <button onClick={() => handleConfirm(signout)}>Sign out</button>}
  </Mutation>
);

export default Signout;
