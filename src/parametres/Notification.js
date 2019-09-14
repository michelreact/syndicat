import React, { Component } from 'react'
import './Notification.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'
import InputText from '../elements/InputText'
import Textarea from '../elements/Textarea'

class Notification extends Component {
    state = {
        redirectionParam: true,
    }

    render () {
        const {
            redirectionParam,
        } = this.state

        // redirection page param
        if (redirectionParam) {
            return <Redirect push to={`/parametres`} />
        }

        
        return (
            <div className='main-div'>
                <p>notifications</p>
            </div>
        )
    }
}

export default Notification
