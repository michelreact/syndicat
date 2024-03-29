import React, { Component } from 'react'
import './Parametres.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'

class Parametres extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // redirection
        redirectionHome: false,
        redirectionProfil: false,
        redirectionListeUsagers: false,
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
                this.setState({ redirectionHome:false, usagerId: user.uid })
            } else {
              this.setState({ redirectionHome:true })
            }
        })
    }

    // profil utilisateur
    clickProfilUtilisateur = () => {
        this.setState({ redirectionProfil:true })
    }

    // liste usagers
    clickListeUsagers = () => {
        this.setState({ redirectionListeUsagers:true })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render () {
        const { 
            // redirection
            redirectionHome, 
            redirectionProfil, 
            redirectionListeUsagers,
            // usagers
            usagers, 
            usagerId 
        } = this.state

        // redirection home
        if (redirectionHome) {
            return <p className='title'>Tu n'es pas connecté</p>
        }

        // redirection profil
        if (redirectionProfil) {
            return <Redirect push to={`/profil`} />
        }

        // redirection liste usagers
        if (redirectionListeUsagers) {
            return <Redirect push to={`/listeUsagers`} />
        }

        // en cours de chargement
        if (usagers) {}else {
            return <p className='title'>En cours de chargement</p>
        }

        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }

        return(
            <div className='div-main'>
                <p className='title'>Paramètres</p>
                <div className='parametres-div-text'
                     onClick={this.clickProfilUtilisateur}>
                    <p>Mon profil</p>
                </div>
                {admin?
                <div className='parametres-div-text'
                     onClick={this.clickListeUsagers}>
                    <p>Liste des usagers</p>
                </div>
                :null}
            </div>
        )
    }
}

export default Parametres

