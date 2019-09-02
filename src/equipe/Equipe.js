import React, { Component } from 'react'
import './Equipe.css'
// elements
import ButtonRed from '../elements/ButtonRed'
// firebase
import base from '../base/base'
import {storage} from '../base/base'
import firebase from 'firebase/app'
import 'firebase/auth'
import syndicat from '../syndicat/Syndicat'
// redirect
import {Redirect} from 'react-router-dom'
import ButtonYellow from '../elements/ButtonYellow'
// image profil sans photo
import profil from '../images/profil.jpg'


class Equipe extends Component {
    state = {
        // base equipe
        equipes: '',
        url: '',
        equipeId: '',
        equipeNom: '',
        equipeFonction: '',
        equipePhoto: '',
        equipeUrl: '',
        // base usagers
        usagers: '',
        uidUsager: '',
        // redirection
        redirectionEquipeForm: false,
        redirectionHome: false,
    }

    componentDidMount () {
        // base equipes
        this.ref = base.syncState(syndicat+'/equipes',{
            context: this,
            state: 'equipes',
        })

        // base usagers
        this.ref2 = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // si non connecter
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ uidUsager: user.uid, redirectionHome:false })
            } else {
              this.setState({ redirectionHome:true })
            }
        })
    }

    // ajouter equipe
    bouttonAjouterEquipier = () => {
        this.setState({redirectionEquipeForm: true})
    }

    // modifier equipe
    bouttonModifier = (key, nom, fonction, photo, url) => {
        const equipeId = key
        const equipeNom = nom
        const equipeFonction = fonction
        const equipePhoto = photo
        const equipeUrl = url
        this.setState({ equipeId, equipeNom, equipeFonction, equipePhoto, equipeUrl, redirectionEquipeForm:true })
    }

    // supprimer equipe
    bouttonSupprimer = (key, photo) => {
        if (window.confirm('es-tu sur de vouloir supprimer cet élément ?')) {
            storage.ref(syndicat).child(photo).delete()
            const equipes = {...this.state.equipes}
            equipes[key] = null
            this.setState({ equipes })
        }
    }

    // deconnecter les bases
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }
    

    render () {
        const { redirectionEquipeForm, usagers, uidUsager, redirectionHome, equipes, equipeId, 
                equipeNom, equipeFonction, equipePhoto, equipeUrl } = this.state
        // --- usagers
        let admin = false
        let recupadmin = null
        let adherent = null
        // redirection
        if (redirectionHome) {
            return <Redirect push to={`/`} />
        }
        // recuperation data usagers
        if (usagers) {
            recupadmin = Object.keys(usagers).filter(key => key === uidUsager).map(key =>
                usagers[key].admin)
            adherent = Object.keys(usagers).filter(key => key === uidUsager).map(key =>
                usagers[key].adherent)     
        }
        // admin 
        if (String(recupadmin) === 'true') {
            admin = true
        }
        // adherent
        if (String(adherent) === 'false') {
            return <p className='title'>Vous devez être adherent pour consulter cette page.</p>
        }
        // redirection
        if (redirectionEquipeForm) {
            return <Redirect push to={{pathname: `/equipe/equipeForm`,
                                        state: {
                                            id: equipeId,
                                            nom: equipeNom,
                                            fonction: equipeFonction,
                                            photo: equipePhoto,
                                            url: equipeUrl

                                        }}} />
        }
        // en cours de chargement
        if (equipes) {} else { return <p className='title'>En cours de chargement</p> }
        // liste equipe
        const list = Object
            .keys(equipes)
            .reverse()
            .map(key =>
                <div key={key} className='equipe-div-liste-main'>
                    <div className='equipe-div-flex'>
                        <div className='equipe-div-photo'>
                            <div className='div-cadre-photo-equipe'>
                                {equipes[key].url?
                                <img className='equipe-photo-equipier' 
                                    alt='equipier' 
                                    src={equipes[key].url} />
                                :
                                <img className='equipe-photo-equipier' 
                                    alt='equipier' 
                                    src={profil} />
                                }

                            </div>
                        </div>
                        <div className='equipe-div-nom'>
                            <p>{equipes[key].nom}</p>
                            <p>{equipes[key].fonction}</p>
                        </div>
                    </div>
                    {admin?
                    <div className='equipe-div-main-liste-boutton'>
                        <div className='equipe-div-liste-boutton-modifier'>
                            <ButtonYellow
                                textButton='modifier'
                                clickButton={() => this.bouttonModifier(
                                    key,
                                    equipes[key].nom,
                                    equipes[key].fonction,
                                    equipes[key].photo,
                                    equipes[key].url
                                )}
                            />
                        </div>
                        <div className='equipe-div-liste-boutton-modifier'>
                            <ButtonRed
                                textButton='supprimer'
                                clickButton={() => this.bouttonSupprimer(
                                    key,
                                    equipes[key].photo
                                     )}
                            />
                        </div>
                    </div>
                    :null}
                </div>
                )
        return(
            <div className='div-main'>
                <p className='title'>Equipe</p>
                {admin ?
                <ButtonRed
                    textButton='Ajouter equipier'
                    clickButton={this.bouttonAjouterEquipier}
                />
                : null}
                {list}
                <br/>
            </div>
        )
    }
}

export default Equipe