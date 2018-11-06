import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import PropTypes from "prop-types";

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
              <UserPermissions key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </>
    )}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      permissions: PropTypes.array.isRequired
    }).isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  handlePermissionChange = e => {
    const { checked, value } = e.target;
    let updatedPermissions = [...this.state.permissions];

    if (checked) {
      updatedPermissions.push(value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== value
      );
    }

    this.setState({
      permissions: updatedPermissions
    });
  };

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
                value={permission}
                checked={this.state.permissions.includes(permission)}
                onChange={this.handlePermissionChange}
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
