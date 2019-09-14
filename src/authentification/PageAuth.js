import React, { Component } from 'react'
import './PageAuth.css'
import InputText from '../elements/InputText'
import ButtonRed from '../elements/ButtonRed'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'

class PageAuth extends Component {
    state = {
        // input connecter et creer compte
        seConnecterEmail: '',
        seConnecterMotDePasse: '',
        creerComptePrenom: '',
        creerCompteNom: '',
        creerCompteTelephone: '',
        creerCompteEmail: '',
        creerCompteMotDePasse: '',
        // redirection
        redirectionHome: false,
        // base usagers
        usagers: '',
    }

    // connecter base usagers
    componentDidMount () {
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })
    }

    // input connexion email
    recuperationConnexionEmail = e => {
        this.setState({ seConnecterEmail: e })
    }

    // input connexion mot de passe
    recuperationConnexionMotDePasse = e => {
        this.setState({ seConnecterMotDePasse: e})
    }

    // boutton se connecter
    bouttonSeConnecter = () => {
        const { seConnecterEmail, seConnecterMotDePasse } = this.state
        if (seConnecterEmail && seConnecterMotDePasse) {
            return new Promise(
                (resolve, reject) => {
                  firebase.auth().signInWithEmailAndPassword(seConnecterEmail.trim(), seConnecterMotDePasse).then(
                    () => {
                      resolve();
                      this.setState({ redirectionHome:true })
                    },
                    (error) => {
                      reject(error);
                      alert('connexion impossible, mail ou mot de passe incorrect')
                    }
                  );
                }
            );
        }else {
            alert('Tous les champs ne sont pas remplis')
        }
    }

    // input creer un compte prenom
    recuperationCreerComptePrenom = e => {
        this.setState({ creerComptePrenom: e })
    }

    // input creer un compte nom
    recuperationCreerCompteNom = e => {
        this.setState({ creerCompteNom: e })
    }

    // input creer un compte prenom
    recuperationCreerCompteTelephone = e => {
        this.setState({ creerCompteTelephone: e })
    }

    // input creer un compte prenom
    recuperationCreerCompteEmail = e => {
        this.setState({ creerCompteEmail: e })
    }

    // input creer un compte prenom
    recuperationCreerCompteMotDePasse = e => {
        this.setState({ creerCompteMotDePasse: e })
    }

    // boutton creer un compte
    bouttonCreerCompte = () => {
        const { creerComptePrenom, creerCompteNom, creerCompteTelephone, creerCompteEmail, creerCompteMotDePasse } = this.state
        if (creerComptePrenom && creerCompteNom && creerCompteEmail && creerCompteMotDePasse) {
            return new Promise(
                (resolve, reject) => {
                // creation et sauvegarde du compte usager
                  firebase.auth().createUserWithEmailAndPassword(creerCompteEmail.trim(), creerCompteMotDePasse)
                    .then(() => {
                        firebase.auth().onAuthStateChanged((user) => {
                            if (user) {
                                const usagers = { ...this.state.usagers }
                                usagers[user.uid] = {
                                    id: user.uid,
                                    prenom: creerComptePrenom,
                                    nom: creerCompteNom.toUpperCase(),
                                    telephone: creerCompteTelephone,
                                    mail: creerCompteEmail,
                                    motdepasse: creerCompteMotDePasse,
                                    adherent: false,
                                    elu: false,
                                    admin: false,
                                    }
                                this.setState({ usagers, redirectionHome:true })
                                resolve();
                            }
                        });
                    },
                    (error) => {
                      reject(error);
                      alert('il y a une erreure')
                    }
                  );
                }
            );
        }else {
            alert('Tous les champs ne sont pas remplis')
        }
    }

    // mot de passe oublié
    bouttonPasswordForget = () => {
        firebase.auth().sendPasswordResetEmail(this.state.seConnecterEmail)
            .then(
                () => {
                    alert('vas sur ta messagerie pour ton nouveau mot de passe')
                },
                (error) => {
                    alert('renseigne ton email')
                }
            );
    }

    // deconnexion base usages
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render () {
        const { redirectionHome } = this.state
        // redirection
        if (redirectionHome) {
            return <Redirect push to={`/`}/>
        }
        return(
            <div className='div-main'>
                <div className='page-auth-div-flex'>
                    <div className='page-auth-div-column'>
                        <p className='title'>Se connecter</p>
                        <p className='text'>Email</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationConnexionEmail} 
                        />
                        <p className='text'>Mot de passe</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationConnexionMotDePasse}
                        />
                        <br/>
                        <ButtonRed
                            textButton={'Se connecter'}
                            clickButton={this.bouttonSeConnecter}
                        />
                        {/* MOT DE PASSE OUBLIER */}
                        <p 
                            onClick={this.bouttonPasswordForget}
                            className='titleclic'>mot de passe oublié</p>
                    </div>
                    <div className='page-auth-div-column'>
                        <div></div>
                        <p className='title'>Creer un compte</p>
                        <p className='text'>Prenom</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationCreerComptePrenom} 
                        />
                        <p className='text'>Nom</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationCreerCompteNom} 
                        />
                        <p className='text'>Téléphone</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationCreerCompteTelephone} 
                        />
                        <p className='text'>Email</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationCreerCompteEmail} 
                        />
                        <p className='text'>Mot de passe</p>
                        <InputText
                            sauvegarde=''
                            recuperationInputText={this.recuperationCreerCompteMotDePasse} 
                        />
                        <br/>
                        <ButtonRed
                            textButton={'Créer un compte'}
                            clickButton={this.bouttonCreerCompte}
                        />
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageAuth
