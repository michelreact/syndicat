import React, { Component } from 'react'
import './ForumSingle.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'

class ForumSingle extends Component {
    state = {
        usagers: '',
        idUsager: '',
        // forum
        forums: '',
        forumId: '',
        textarea: '',
        // redirection
        redirectionForum: false,
        // test
        texttest: '',
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
                this.setState({ idUsager: user.uid })
            }
        })
        
        // props forum
        const forumId = this.props.location.state.id
        this.setState({ forumId })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionForum: true })
    }

    // boutton supprimer message
    bouttonSupprimerMessage = (key, i) => {
        if (window.confirm('es-tu sur de vouloir supprimer cet élément ?')) {
            // supprimer le sujet database
            const forums = { ...this.state.forums }
            forums[key].messages[i] = null
            this.setState({ forums })
        }
    }

    // textarea
    onChange = e => {
        const textarea = e.target.value
        this.setState({ textarea })
    }

    // boutton repondre
    bouttonRepondre = () => {
        const forums = { ...this.state.forums }
        const usagers = { ...this.state.usagers }
        const { forumId, textarea, idUsager } = this.state
        let prenom = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].prenom)
        let nom = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].nom)
        const d = new Date()
        let date = d.getHours()+":"+d.getMinutes()+" "+
                         d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
        if (textarea) {
            forums[forumId].messages.push({
                auteur: prenom+' '+nom,
                date: date,
                message: textarea
            })
            this.setState({ forums, textarea:'' })
        } else {
            alert('le message est vide')
        }
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render() {
        const { redirectionForum, forumId, forums, textarea, usagers, idUsager } = this.state

        // redirection forum
        if (redirectionForum) {
            return <Redirect push to={`/forum`} />
        }

        // en cours de chargement
        if (forums) {}else {return <p className='title'>En cours de chargement</p>}

        
        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }


        // liste des messages
        const list = Object
            .keys(forums)
            .filter(key => key === forumId)
            .map(key =>
                <div className='forum-single-list-div-main' key={key}>
                    <p className='title'>{forums[key].sujet}</p>
                {forums[key].messages
                    .reverse()
                    .map((ite, index) =>
                        <div className='forum-single-list-div-message' key={index}>
                            <p>
                                <strong>Auteur : </strong>
                                {ite.auteur + ' - '}
                                <span>{ite.date}</span>
                            </p>
                            <p>{ite.message}</p>
                            {admin || ite.auteur === forums[key].auteur?
                                <h3 
                                    className='forum-text-supprimer-sujet'
                                    onClick={() => this.bouttonSupprimerMessage(key, index)}>supprimer le message</h3>
                            :null}
                        </div>
                    )}
                </div>)

        return(
            <div className='div-main'>   
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                /> 
                <div className='forum-single-div-textarea'>
                    <textarea
                        type='text'
                        placeholder='TEXT ICI'
                        maxLength={5000}
                        onChange={this.onChange}
                        value={textarea}
                    />           
                </div>
                <br/>
                <ButtonRed
                    textButton='Repondre'  
                    clickButton={this.bouttonRepondre}                  
                />
                <div>
                    {list}
                </div>
            </div>
        )
    }
}

export default ForumSingle
