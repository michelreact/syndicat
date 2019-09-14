import React, { Component } from 'react'
import './ForumAccueil.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
import ButtonRed from '../elements/ButtonRed'

class ForumAccueil extends Component {
    state = {
        // base
        usagers: '',
        idUsager: '',
        // redirection
        redirectionHome: false,
        redirectionForumElu: false,
        redirectionFormAdherent: false,
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
                this.setState({ idUsager: user.uid, redirectionHome:false })
            } else {
              this.setState({ redirectionHome:true })
            }
        })  
    }

    bouttonForumAdherent = () => {
        this.setState({ redirectionFormAdherent: true })
    }

    bouttonForumElu = () => {
        this.setState({ redirectionForumElu: true })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render () {
        const { 
            // redirection
            redirectionHome,
            redirectionForumElu,
            redirectionFormAdherent,
            // base usagers
            usagers,
            idUsager,
        } = this.state

        // redirection home
        if (redirectionHome) {
            return <p className='title'>Tu n'es pas connecté</p>
        }

        // redirection forum elu
        if (redirectionForumElu) {
            return <Redirect push to={`/forum/elu`} />
        }

        // redirection forum elu
        if (redirectionFormAdherent) {
            return <Redirect push to={`/forum/adherent`} />
        }

        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <p className='title'>tu dois être adherent pour consulter cette page.</p>
        }

        return (
            <div className='div-main'>
                <p className='title'>forum</p>
                <div className='forum-accueil-div-flex'>
                    <div className='forum-accueil-div-flex-forum'>
                        <ButtonRed
                            textButton='forum adherents'
                            clickButton={this.bouttonForumAdherent}
                        />
                    </div>
                    <div className='forum-accueil-div-flex-forum'>
                    <ButtonRed
                            textButton='forum elus'
                            clickButton={this.bouttonForumElu}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ForumAccueil
