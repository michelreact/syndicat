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
        redirectionForum: false,
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

    bouttonRetour = () => {
        this.setState({ redirectionForum: true })
    }

    // ajouter un sujet
    bouttonAjouterSujet = () => {
        this.setState({ redirectionForumForm: true })
    }

    // supprimer un sujet
    bouttonSupprimerSujet = (key) => {
        if (window.confirm('es-tu sur de vouloir supprimer cet élément ?')) {
                // supprimer le sujet database
                const forums = { ...this.state.forums }
                forums[key] = null
                this.setState({ forums })
        }
    }

    // click liste sujet
    clickListeMessage = (id) => {
        this.setState({ forumId: id, redirectionForumSingle: true })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render() {
        const { redirectionHome, redirectionForumForm, idUsager, usagers, redirectionForumSingle, redirectionForum,
                forums, forumId } = this.state
        
        // redirection home
        if (redirectionHome) {
            return <p className='title'>Tu n'es pas connecté</p>
        }

        // redirection forum
        if (redirectionForum) {
            return <Redirect push to={`/forum`} />
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
            return <p className='title'>Tu dois être adherent pour consulter cette page.</p>
        }

        // si elu
        let elu = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].elu)
        if (String(elu) === 'false') {
            return <p className='title'>Tu dois être elu pour consulter cette page.</p>
        }

        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }

        // en cours de chargement
        if (forums){}else{return <p className='title'>En cours de chargement</p>}

        // liste forum
        const liste = Object.keys(forums).reverse().map(key =>
        <div key={key} className='forum-div-list-sujet'>
            <div 
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
            {admin?
                <h3 
                    className='forum-text-supprimer-sujet'
                    onClick={() => this.bouttonSupprimerSujet(key)}>supprimer le sujet</h3>
            :null}
        </div>
            )

        return(
            <div className='div-main'>
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='title'>Forum elus</p>
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

