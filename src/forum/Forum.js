import React, { Component } from 'react'
import './Forum.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'

class Forum extends Component {
    state = {
        // base usagers
        usagers: '',
        idUsager: '',
        // base forum
        forums: '',
        // redirection
        redirectionHome: false,
        redirectionForumForm: false,
        redirectionForumSingle: false,
    }

    componentDidMount () {
        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base tracts
        this.ref2 = base.syncState(syndicat+'/forums',{
            context: this,
            state: 'forums'
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

    // ajouter un sujet
    bouttonAjouterSujet = () => {
        this.setState({ redirectionForumForm:true })
    }

    // click liste sujet
    clickListeMessage = (id) => {
        this.setState({ forumId: id, redirectionForumSingle:true })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render() {
        const { redirectionHome, redirectionForumForm, idUsager, usagers, redirectionForumSingle,
                forums, forumId } = this.state
        
        // redirection home
        if (redirectionHome) {
            return <Redirect push to={`/`} />
        }

        // redirection forum form
        if (redirectionForumForm) {
            return <Redirect push to={`/forum/form`} />
        }

        // redirection forum single
        if (redirectionForumSingle) {
            return <Redirect push to={{
                pathname:`/forum/single`,
                state: {
                    id: forumId
                }
            }} />
        }
        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <p className='title'>Vous devez être adherent pour consulter cette page.</p>
        }

        // si elu
        let elu = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].elu)
        if (String(elu) === 'false') {
            return <p className='title'>Vous devez être elu pour consulter cette page.</p>
        }

        // en cours de chargement
        if (forums){}else{return <p className='title'>En cours de chargement</p>}

        // liste forum
        const liste = Object.keys(forums).reverse().map(key =>
            <div 
                key={key} 
                onClick={() => this.clickListeMessage(key)}
                className='forum-div-flex'>
                <div className='forum-div-column-sujet'>
                    <p>{forums[key].sujet}</p>
                </div>
                <div className='forum-div-column-droite'>
                    <p className='forum-date'>{forums[key].auteur}</p>
                </div>
                <div className='forum-div-column-droite'>
                    <p className='forum-date'>{forums[key].date}</p>
                </div>
            </div>
            )
        return(
            <div className='div-main'>
                <p className='title'>Forum</p>
                <ButtonRed
                    textButton='Ajouter un sujet'
                    clickButton={this.bouttonAjouterSujet}
                />
                {liste}
            </div>
        )
    }
}

export default Forum

