import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import QRCode from 'qrcode'
import {getPass, me, sendEmail} from '../store'

/**
 * COMPONENT
 */
export class Qrcode extends Component {
  constructor(props) {
    super(props)

    this.generateQR = this.generateQR.bind(this)
    this.sendQrEmail = this.sendQrEmail.bind(this)
  }

  generateQR() {
    console.log('WHO Am I ', this.props.user.password)

    let obj = `{
      userId: ${this.props.selectedUser.id},
      name: ${this.props.selectedUser.name}
      email: ${this.props.selectedUser.email}
      password: ${this.props.user.password}
      company: ${this.props.selectedUser.company}
    }`

    QRCode.toCanvas(document.getElementById('canvas'), obj, function(error) {
      if (error) console.error(error)
      //console.log('success!')
    })
  }

  sendQrEmail() {
    //console.log('send Email: ', this.props.emailQr('test'))

    let obj = `{"userId": ${this.props.selectedUser.id},"name": "${
      this.props.selectedUser.name
    }","email": "${this.props.selectedUser.email}","password": "${
      this.props.user.password
    }","company": "${this.props.selectedUser.company}"}`

    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      rendererOpts: {
        quality: 0.3
      }
    }

    let myUrl = ''
    QRCode.toDataURL(obj, opts, function(err, url) {
      console.log(url)
      myUrl = url
    })
    this.props.emailQr(myUrl)
  }

  componentDidMount() {
    this.props.getPassword(this.props.selectedUser.id, this.generateQR)
  }

  render() {
    console.log(this.props, this.props.whoAmI)
    return (
      <div>
        <h3>QR Code </h3>
        <canvas id="canvas"> </canvas>
        <button onClick={this.sendQrEmail}>Email QR</button>
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
    getPassword: (userId, fn) => {
      dispatch(getPass(userId, fn))
    },
    whoAmI: () => {
      dispatch(me())
    },
    emailQr: qr => {
      dispatch(sendEmail(qr))
    }
  }
}

export default connect(mapState, mapDispatch)(Qrcode)

/**
 * PROP TYPES
 */
Qrcode.propTypes = {
  email: PropTypes.string
}
