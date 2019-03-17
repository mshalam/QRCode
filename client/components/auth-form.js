import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Container, Button} from 'semantic-ui-react'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div align="center">
      <Container text style={{marginTop: '7em'}}>
        <form onSubmit={handleSubmit} name={name}>
          <div>
            <label htmlFor="email">Email</label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" />
          </div>
          <div>
            <Button type="submit" color="blue" fluid size="tiny">
              Login
            </Button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>

        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/qstx2HUHiAU"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </Container>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}

// <Form size="large">
//             <Segment stacked>
//               <Form.Input
//                 fluid
//                 icon="user"
//                 iconPosition="left"
//                 placeholder="E-mail address"
//               />
//               <Form.Input
//                 fluid
//                 icon="lock"
//                 iconPosition="left"
//                 placeholder="Password"
//                 type="password"
//               />

//               <Button color="green" fluid size="large" type="submit">
//                 Login
//               </Button>
//             </Segment>
//           </Form>
