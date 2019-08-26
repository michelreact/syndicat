import React, { Component } from 'react'
import './Tracts.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// storage
import {storage} from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'
import ButtonYellow from '../elements/ButtonYellow'

class Tracts extends Component {
    state = {
        // base usagers
        usagers: '',
        id: '',
        // base tracts
        tracts: '',
        tractTitre: '',
        tractFichier: '',
        tractId: '',
        // redirection
        redirectionHome: false,
        redirectionTractForm: false,
    }

    componentDidMount () {
        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base tracts
        this.ref2 = base.syncState(syndicat+'/tracts',{
            context: this,
            state: 'tracts'
        })

        // Si Authentifier
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ id: user.uid, redirectionHome:false })
            } else {
              this.setState({ redirectionHome:true })
            }
        })
    }

    // ajouter un tract
    bouttonAjouterTract = () => {
        this.setState({ redirectionTractForm:true })
    }

    // telechager fichier
    bouttonTelecharger = fichier => {
        storage.ref(syndicat).child(fichier).getDownloadURL().then(url => {
            window.open(url)
        })
    }

    // modifier tract 
    bouttonModifierTract = (titre, fichier, id) => {
        const tractTitre = titre
        const tractFichier = fichier
        const tractId = id
        this.setState({ tractTitre, tractFichier, tractId, redirectionTractForm:true })
    }

    // supprimer tract
    bouttonSupprimerTract = (id, fichier) => {
        storage.ref(`${syndicat}${fichier}`).delete()
        const tracts = {...this.state.tracts}
        tracts[id] = null
        this.setState({ tracts })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }
    

    render() {
        const { redirectionHome, redirectionTractForm, usagers, id, tracts,
                tractTitre, tractFichier, tractId } = this.state
        // redirection
        if (redirectionHome) {
            return <Redirect push to={`/`} />
        }
        if (redirectionTractForm) {
            return <Redirect push to={{
                pathname:`/tracts/tractForm`, 
                state: {titre: tractTitre, fichier: tractFichier, id: tractId}  
            }} />
        }
        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === id).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <p className='title'>Vous devez être adherent pour consulter cette page.</p>
        }
        // si admin
        let admin = false
        let buttonAddTract = null
        let recupadmin = Object.keys(usagers).filter(key => key === id).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
            buttonAddTract = (
                <ButtonRed
                    textButton='Ajouter un tract'
                    clickButton={this.bouttonAjouterTract}
                />)
        }
        // en cours de chargement
        if (tracts){}else { return <p className='title'>En cours de chargement</p>}
        // tracts
        let list = Object.keys(tracts).reverse().map(key =>
            <div key={key} className='tracts-div-flex'>
                <div className='tracts-div-column-text'>
                    <p>{tracts[key].titre}</p>
                    <button
                        className='tracts-boutton-telecharger'
                        type='button'
                        onClick={() => this.bouttonTelecharger(tracts[key].fichier)}
                        >telecharger</button>
                </div>
                {admin?
                <div className='tracts-div-column-button'>
                    <ButtonYellow
                        textButton='Modifier'
                        clickButton={() => this.bouttonModifierTract(
                            tracts[key].titre,
                            tracts[key].fichier,
                            key
                        )}
                    />
                </div>
                :null}
                {admin?
                <div className='tracts-div-column-button'>
                    <ButtonRed
                        textButton='Supprimer'
                        clickButton={() => this.bouttonSupprimerTract(key, tracts[key].fichier)}
                    />
                </div>
                :null}
            </div>
            )
        return(
            <div className='div-main'>
                <p className='title'>Tracts</p>
                {buttonAddTract}
                {list}
            </div>
        )
    }
}

export default Tracts
