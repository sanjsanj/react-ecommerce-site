import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";

import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <>
        {loading && <p>Loading...</p>}

        <Error error={error} />

        <h2>Manage permissions</h2>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map(permission => (
                <th key={permission}>{permission}</th>
              ))}
              <th>👇🏻</th>
            </tr>
          </thead>

          <tbody>
            {data.users.map(user => (
              <User key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </>
    )}
  </Query>
);

class User extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                disabled
                checked={user.permissions.includes(permission)}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;
