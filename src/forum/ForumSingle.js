import React, { Component, createRef } from 'react'
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

    // create ref
    messagesRef = createRef()

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

    componentDidUpdate () {
        const ref = this.messagesRef.current
        // ref.scrollTop = ref.scrollHeight
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
        let forumSujet = Object.keys(usagers).filter(key => key === idUsager).map(key => usagers[key].sujet)
        const d = new Date()
        let date = d.getHours()+":"+d.getMinutes()+" "+
                         d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()

        if (textarea) {
            if (forums[forumId].messages) {
                forums[forumId].messages.push({
                    auteur: prenom+' '+nom,
                    date: date,
                    message: textarea
                })
                this.setState({ forums, textarea:'' })
            } else {
                forums[forumId] = {
                    messages: [
                        {message: textarea, auteur: prenom+' '+nom, date: date},
                    ]
                }
                this.setState({ forums, textarea: '' })
            }
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
                    {forums[key].messages?
                    forums[key].messages
                    .map((ite, index) =>
                        <div className='forum-single-list-div-message' key={index} >
                            <div className='forum-single-div-flex'>
                                <div className='forum-single-div-text-droite'>
                                    {ite.auteur + ' - '}
                                    <span>{ite.date}</span>
                                </div>
                                <div className='forum-single-div-text-gauche'>
                                    {admin || ite.auteur === forums[key].auteur?
                                    <span
                                        className='forum-text-supprimer-sujet'
                                        onClick={() => this.bouttonSupprimerMessage(key, index)}>supprimer le message</span>
                                    :null}
                                </div>
                            </div>
                            <p>{ite.message}</p>
                        </div>
                    )
                    :null}
                </div>)

        return(
            <div className='div-main'>   
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                /> 
                <div className='messages' ref={this.messagesRef}>
                    <div className='message'>
                        {list}
                    </div>
                </div>
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
                <br/>
                <br/>
            </div>
        )
    }
}

export default ForumSingle
