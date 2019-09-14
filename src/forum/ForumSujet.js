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


class ForumSujet extends Component {
    state = {
        // usagers
        usagers: '',
        idUsager: '',
        // forums
        forums: '',
        forumSujet: '',
        forumMessage: '',
        // redirection
        redirectionHome: false,
        redirectionForum: false,
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

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionForum: true })
    }

    // sujet
    recuperationInputSujet = e => {
        this.setState({ forumSujet: e })
    }

    // message
    recuperationTextarea = e => {
        this.setState({ forumMessage: e })
    }

    // boutton valider
    bouttonValider = () => {
        const forums = { ...this.state.forums }
        const usagers = { ...this.state.usagers }
        const { forumSujet, forumMessage, idUsager } = this.state
        let prenom = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].prenom)
        let nom = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].nom)
        if (forumSujet && forumMessage) {
        const dataDate = Date.now()
        const d = new Date()
        let date = d.getHours()+":"+d.getMinutes()+" "+
                   d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()  
            forums[dataDate] = {
                sujet: forumSujet,
                uid: idUsager,
                auteursujet: prenom+' '+nom,
                dernierauteur: prenom+' '+nom,
                id: dataDate,
                datadate: dataDate,
                date: date,
                messages: [
                    {message: forumMessage, auteur: prenom+' '+nom, date: date, datadate: dataDate},
                ],
            }
            this.setState({ forums, redirectionForum:true })
        }else {
            alert('Tous les champs ne sont pas remplis')
        }
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render () {
        const {
            redirectionHome,
            redirectionForum,
        } = this.state

        // redirection home
        if (redirectionHome) {
            return <Redirect push to={`/`} />           
        }

        // redirection
        if (redirectionForum) {
            return <Redirect push to={`/forum/adherent`} />
        }

        return (
            <div className='div-main'>
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='text'>Sujet</p>
                <InputText
                    recuperationInputText={this.recuperationInputSujet}
                    sauvegarde=''
                />
                <p className='text'>Message</p>
                <Textarea
                    sauvegarde=''
                    height={100}
                    recuperationTextarea={this.recuperationTextarea}
                />
                <br/>
                <ButtonRed
                    textButton='Valider'
                    clickButton={this.bouttonValider}
                />
                <br/>
            </div>
        )
    }
}

export default ForumSujet
