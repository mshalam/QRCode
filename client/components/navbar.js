import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout, resetHomePage} from '../store'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from 'semantic-ui-react'

class Navbar extends Component {
  render() {
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item
              as={Link}
              to="/home"
              onClick={this.props.resetHomeP}
              header
            >
              <Image
                size="mini"
                src="/logo.png"
                style={{marginRight: '1.5em'}}
              />
            </Menu.Item>
            {this.props.isLoggedIn ? (
              <>
                {/* The navbar will show these links after you log in */}
                <Menu.Item as={Link} to="/home" onClick={this.props.resetHomeP}>
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/qrreader">
                  Qr Reader
                </Menu.Item>
                <Menu.Item as="a" to="#" onClick={this.props.handleClick}>
                  Logout
                </Menu.Item>
              </>
            ) : (
              <>
                {/* The navbar will show these links before you log in */}
                <Menu.Item as={Link} to="/login">
                  Login
                </Menu.Item>
              </>
            )}
          </Container>
        </Menu>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    resetHomeP() {
      dispatch(resetHomePage())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
