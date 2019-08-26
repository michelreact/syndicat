import React, { Component } from 'react'
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
        // base usagers
        usagers: '',
        usagerId: '',
        // redirection
        redirectionParam: false,
    }

    componentDidMount () {
        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
        context: this,
            state: 'usagers'
        })

        // Si Authentifier
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // recuperation du id
                this.setState({ id: user.uid })          
            }
        })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionParam: true })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render () {
        const {
            // usagers
            usagers,
            usagerId,
            // redirection
            redirectionParam,
        } = this.state

        // redirection page param
        if (redirectionParam) {
            return <Redirect push to={`/parametres`} />
        }

        // si admin
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'false') {
            return <Redirect push to={`/parametres`} />
        }
        
        return (
            <div className='main-div'>
                {/* BOUTTON RETOUR */}
                <br/>
                <ButtonRed 
                    textButton='Retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='text'>Page notification</p>
            </div>
        )
    }
}

export default Notification
