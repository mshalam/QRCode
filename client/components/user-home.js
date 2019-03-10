import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Qrcode from './qrcode'
import {getAllMyUsers, showQR} from '../store'

/**
 * COMPONENT
 */
export class UserHome extends Component {
  constructor() {
    super()
    this.state = {
      selectedUser: {}
    }
  }

  componentDidMount() {
    this.props.getMyUsers(this.props.user.id)
  }
  render() {
    const {name, company} = this.props.user

    return (
      <div>
        {this.props.user.showQr ? (
          <div>
            {' '}
            <Qrcode selectedUser={this.state.selectedUser} />{' '}
          </div>
        ) : (
          <div>
            <h3 align="center">Welcome, {name.toUpperCase()}</h3>
            <h4 align="center">
              You can manage user access for{' '}
              {company ? company.toUpperCase() : 'All Companies'}
            </h4>
            <table>
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Access</th>
                  <th>SendQr</th>
                </tr>
              </tbody>
              {this.props.user.users ? (
                <>
                  {this.props.user.users[0].map(currUser => {
                    return (
                      <tbody key={currUser.id}>
                        <tr>
                          <td>{currUser.id}</td>
                          <td>{currUser.name}</td>
                          <td>{currUser.email}</td>
                          <td>{currUser.company}</td>
                          <td>
                            <select>
                              <option value={currUser.access}>
                                {currUser.access}
                              </option>
                              <option value="saab">Company Admin</option>
                              <option value="mercedes">user</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => {
                                this.setState({selectedUser: currUser})
                                this.props.showQRCode()
                              }}
                            >
                              Generate QR!
                            </button>
                          </td>
                          <td>
                            <button type="button">Delete User</button>
                          </td>
                        </tr>
                      </tbody>
                    )
                  })}
                </>
              ) : null}
            </table>
          </div>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getMyUsers: userId => {
      dispatch(getAllMyUsers(userId))
    },
    showQRCode: () => {
      dispatch(showQR())
    }
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
