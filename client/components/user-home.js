import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Qrcode from './qrcode'
import {getAllMyUsers, showQR} from '../store'
import {Container, Table, Button} from 'semantic-ui-react'

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
        <Container text style={{marginTop: '7em'}}>
          {this.props.user.showQr ? (
            <div align="center">
              <Qrcode selectedUser={this.state.selectedUser} />
            </div>
          ) : (
            <div>
              <h3 align="center">Welcome, {name.toUpperCase()}</h3>
              <h4 align="center">
                You can manage user access for{' '}
                {company ? company.toUpperCase() : 'All Companies'}
              </h4>
              <Table inverted>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Id</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Access</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {this.props.user.users ? (
                  <>
                    {this.props.user.users[0].map(currUser => {
                      return (
                        <Table.Body key={currUser.id}>
                          <Table.Row>
                            <Table.Cell>{currUser.id}</Table.Cell>
                            <Table.Cell>{currUser.name}</Table.Cell>
                            <Table.Cell>{currUser.email}</Table.Cell>
                            <Table.Cell>{currUser.company}</Table.Cell>
                            <Table.Cell>{currUser.access}</Table.Cell>
                            <Table.Cell>
                              <Button
                                inverted
                                color="green"
                                onClick={() => {
                                  this.setState({selectedUser: currUser})
                                  this.props.showQRCode()
                                }}
                              >
                                Generate QR!
                              </Button>
                            </Table.Cell>
                            <Table.Cell>
                              <Button inverted color="red">
                                <i className="trash alternate icon" />
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      )
                    })}
                  </>
                ) : null}
              </Table>
            </div>
          )}
        </Container>
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
