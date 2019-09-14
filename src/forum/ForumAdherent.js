import React, { Component } from 'react'
import './ForumAdherent.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ForumAdherent extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // forums
        forums: '',
        // classement sujet
        newState: '',
        // redirection
        redirectionForum: false,
        redirectionSujet: false,
        // modal
        modal: false,
        // current key
        currentKEY: '',
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
                this.setState({ usagerId: user.uid })
            }
        })

        // classement afphabetique des usagers
        const recup = firebase.database().ref('web3/forums').orderByChild('id')
        recup.on('value', snapshot => {
            let newState = []
            snapshot.forEach(childSnapshot =>{
                var childData = childSnapshot.val()
                newState.push({
                    sujet: childData.sujet,
                    auteur: childData.dernierauteur,
                    date: childData.date,
                    id: childData.id,
                    uid: childData.uid
                })        
            }) 
            this.setState({ newState })                     
        })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionForum: true })
    }

    // boutton creer un sujet
    bouttonAjouterSujet = () => {
        this.setState({ redirectionSujet: true })
    }

    // boutton redirection liste des messages du sujet
    bouttonJaune = () => {
        alert('boutton jaune')
    }

    // afficher modal
    bouttonModal = (key) => {
        this.setState(prevState => ({ modal: !prevState.modal, currentKEY: key }));
    }

    // boutton supprimer sujet
    bouttonSupprimerSujet = () => {
        // supprimer le sujet database
        const forums = { ...this.state.forums }
        forums[this.state.currentKEY] = null
        this.setState({ forums })
        this.setState(prevState => ({ modal: !prevState.modal, currentKEY: '' }));
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }



    render () {
        const {
            // usagers
            usagers,
            usagerId,
            // forums
            forums,
            // classement sujet forum
            newState,
            // redirection
            redirectionForum,
            redirectionSujet,
        } = this.state

        // redirection forum
        if (redirectionForum) {
            return <Redirect push to={`/forum`} />
        }

        // redirection forum
        if (redirectionSujet) {
            return <Redirect push to={`/forum/sujet`} />
        }

        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <p className='title'>Tu dois être adherent pour consulter cette page.</p>
        }

        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }

        // si admin
        let elu = false
        let recupelu = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].elu)
        if (String(recupelu) === 'true') {
            elu = true
        }


        // afficher la list
        const list = Object.keys(newState)
            .reverse()
            .filter(key => newState[key].uid === usagerId)
            .map(key =>
                <div key={key} className='forum-adherent-sujet-div-flex'>
                    <div className='forum-adherent-sujet-div-flex-2' onClick={() => this.bouttonJaune()}>
                        <p className='forum-adherent-sujet-div-titre'>{newState[key].sujet}</p>
                        <p className='forum-adherent-sujet-div-auteur'>{newState[key].auteur}</p>
                        <p className='forum-adherent-sujet-div-date'>{newState[key].date}</p>
                    </div>
                    {admin? 
                    <div className='forum-adherent-sujet-div-flex-3' onClick={() => this.bouttonModal(newState[key].id)}>
                        <p className='forum-adherent-sujet-div-plus'>+</p>
                    </div>
                    :null}
                </div>
            )

        return (
            <div className='div-main'>
                <br/>
                <div className='forum-adherent-div-entete-flex'>
                    <div className='forum-adherent-entete-element'>
                        <ButtonRed
                            textButton='retour'
                            clickButton={this.bouttonRetour}
                        />
                    </div>
                    <div className='forum-adherent-entete-element'>
                        <p className='title'>Forum adhérents</p>
                    </div>
                    <div className='forum-adherent-entete-element'>
                        <ButtonRed
                            textButton='Ajouter un sujet'
                            clickButton={this.bouttonAjouterSujet}
                        />
                    </div>
                </div>
                {list}
                <Modal isOpen={this.state.modal} >
                    <ModalHeader toggle={this.bouttonModal}></ModalHeader>
                    <ModalBody>veux-tu modifier ou supprimer l'élément ?</ModalBody>
                    <ModalFooter>
                        <Button color="warning" onClick={this.bouttonModifierSujet}>modifier</Button>{' '}
                        <Button color="danger" onClick={this.bouttonSupprimerSujet}>supprimer</Button>{' '}
                        <Button color="primary" onClick={this.bouttonModal}>annuler</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ForumAdherent