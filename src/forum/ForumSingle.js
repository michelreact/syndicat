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
        // usages
        usagers: '',
        idUsager: '',
        // forum
        forums: '',
        forumId: '',
        textarea: '',
        // redirection
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
                this.setState({ idUsager: user.uid })
            }
        })
        
        // props forum
        const forumId = this.props.location.state.id
        this.setState({ forumId })
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
        const { redirectionForum, forumId, forums, textarea } = this.state

        // redirection forum
        if (redirectionForum) {
            return <Redirect push to={`/forum`} />
        }

        // en cours de chargement
        if (forums) {}else {return <p className='title'>En cours de chargement</p>}

        // liste des messages
        const list = Object
            .keys(forums)
            .filter(key => key === forumId)
            .map(key =>
                <div className='forum-single-list-div-main' key={key}>
                    <p className='title'>{forums[key].sujet}</p>
                {forums[key].messages
                    .reverse()
                    .map(ite =>
                        <div className='forum-single-list-div-message' key={ite.message}>
                            <p>
                                <strong>Auteur : </strong>
                                {ite.auteur + ' - '}
                                <span>{ite.date}</span>
                            </p>
                            <p>{ite.message}</p>
                        </div>
                    )}
                </div>)
        return(
            <div className='div-main'>    
                <p className='title'>Forum</p>
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
                {list}
            </div>
        )
    }
}

export default ForumSingle
