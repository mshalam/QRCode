import React, {Component} from 'react'
import {connect} from 'react-redux'
import QrReader from 'react-qr-reader'
import {validateQr} from '../store'

class QrReaderComp extends Component {
  constructor() {
    super()
    this.state = {
      result: 'No result'
    }

    this.called = false

    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleScan(data) {
    if (data) {
      this.setState({
        result: data
      })
    }
  }

  handleError(err) {
    console.error(err)
  }

  //check if valid user?
  validate(qrStr) {
    let qr = JSON.parse(qrStr)
    console.log('valid method call', qr, this.called, this.props.user)

    //lets validate if the user can come in ?
    if (!this.called) {
      console.log('valid route called')
      this.props.checkValid(qr.email, qr.password)
      this.called = true
    }
  }

  componentDidMount() {
    console.log('is this even rendering')
  }

  render() {
    return (
      <div align="center">
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{width: '15%', height: '90%'}}
        />

        <div>
          {!(this.state.result === 'No result') ? (
            this.validate(this.state.result)
          ) : (
            <></>
          )}
        </div>

        <div>
          {this.props.user.valid ? (
            this.props.user.valid === 'valid' ? (
              <div
                align="center"
                style={{
                  backgroundColor: '#4BB543',
                  padding: '40px 0 30px 0',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '24px'
                }}
              >
                Access Granted
              </div>
            ) : (
              <div
                align="center"
                style={{
                  backgroundColor: '#FF0000',
                  padding: '40px 0 30px 0',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '24px'
                }}
              >
                Access Denied
              </div>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    checkValid: (email, password) => {
      dispatch(validateQr(email, password))
    }
  }
}

export default connect(mapState, mapDispatch)(QrReaderComp)
