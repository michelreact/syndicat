import React, { Component } from 'react'
import './ProfilUsager.css'
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

class ProfilUsager extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // redirection
        redirectionListUsager: false,
        // modifier profil
        modifierProfil: false,
        // data usager
        id: '',
        prenom: '',
        nom: '',
        telephone: '',
        adresse: '',
    }

    componentDidMount () {
        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // Si Authentifier
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ usagerId: user.uid })
            }
        })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionListUsager: true })
    }

    // boutton modifier le profil
    bouttonModifierProfil = () => {
        this.setState ({ modifierProfil: true })
    }

    bouttonAbandonner = () => {
        this.setState ({ modifierProfil: false })
    }

    // boutton sauvegarder profil
    bouttonSauvegarderProfil = () => {
        const usagers = { ...this.state.usagers }
        const { prenom, nom, telephone, adresse } = this.state
        if (prenom !== '') {usagers[this.props.location.state.selectId] = {prenom: prenom}}
        if (nom !== '') {usagers[this.props.location.state.selectId] = {nom: nom.toUpperCase()}}
        if (telephone !== '') {usagers[this.props.location.state.selectId] = {telephone: telephone}}
        if (adresse !== '') {usagers[this.props.location.state.selectId] = {adresse: adresse}}
        this.setState({ usagers, modifierProfil: false })
    }

    // prenom
    recuperationInputPrenom = e => {
        this.setState({ prenom: e })
    }

    // nom
    recuperationInputNom = e => {
        this.setState({ nom: e })
    }

    // telephone
    recuperationInputTelephone = e => {
        this.setState({ telephone: e })
    }

    // adresse 
    recuperationInputAdresse = e => {
        this.setState({ adresse: e })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }


    render () {
        const {
            // usagers 
            usagers,
            usagerId,
            // redirection
            redirectionListUsager,
            // modifier profil
            modifierProfil,
        } = this.state

        // redirection list usager
        if (redirectionListUsager) {
            return <Redirect push to={`/listeUsagers`} />
        }

        // si admin
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'false') {
            return <Redirect push to={`/parametres`} />
        } 

        // profil usager
        const profil = Object.keys(usagers).filter(key => key === this.props.location.state.selectId).map(key =>
            <div key={key}>
                <p>Nom : {usagers[key].nom} {usagers[key].prenom}</p>
                <p>Telephone : {usagers[key].telephone}</p>
                <p>Email : {usagers[key].mail}</p>
                <p className='profil-usager-adresse'>Adresse : {usagers[key].adresse}</p>
                {usagers[key].adherent?
                    <p>Adherent : oui</p>
                :
                    <p>Adherent : non </p>
                }
                {usagers[key].elu?
                    <p>Elu : oui</p>
                :
                    <p>Elu : non </p>
                }
                {usagers[key].admin?
                    <p>Administrateur : oui</p>
                :
                    <p>Administrateur : non </p>
                }
            </div>
            )

        // recuperation du profil
        let recuperationPrenom = null
        let recuperationNom = null
        let recuperationTelephone = null
        let recuperationAdresse = null
        if (usagers) {
            recuperationPrenom = Object.keys(usagers).filter(key => key === this.props.location.state.selectId).map(key => 
                <InputText key={key}
                sauvegarde={usagers[key].prenom}
                recuperationInputText={this.recuperationInputPrenom}/>)
            recuperationNom = Object.keys(usagers).filter(key => key === this.props.location.state.selectId).map(key => 
                <InputText key={key}
                sauvegarde={usagers[key].nom}
                recuperationInputText={this.recuperationInputNom}/>)
            recuperationTelephone = Object.keys(usagers).filter(key => key === this.props.location.state.selectId).map(key => 
                <InputText key={key}
                sauvegarde={usagers[key].telephone}
                recuperationInputText={this.recuperationInputTelephone}/>)
            recuperationAdresse = Object.keys(usagers).filter(key => key === this.props.location.state.selectId).map(key => 
                <Textarea key={key}
                    height={80}
                    recuperationTextarea={this.recuperationInputAdresse}
                    sauvegarde={usagers[key].adresse}
                />)
        }

        return (
            <div className='div-main'>
                <p></p>
                {/* BOUTTON RETOUR */}
                <ButtonRed 
                    textButton='Retour'
                    clickButton={this.bouttonRetour}
                />
                {/* TITRE PROFIL USAGER */}
                <p className='title'>Profil usager</p>
                {profil}
                <p></p>
                {modifierProfil?
                <div>
                <ButtonRed
                    textButton='Abandonner'
                    clickButton={this.bouttonAbandonner}
                />
                <p className='text'>Prenom</p> 
                {recuperationPrenom}
                <p className='text'>Nom</p> 
                {recuperationNom}
                <p className='text'>Telephone</p> 
                {recuperationTelephone}
                <p className='text'>Adresse</p> 
                {recuperationAdresse}
                <br/>
                <ButtonRed
                    textButton='Sauvegarder'
                    clickButton={this.bouttonSauvegarderProfil}
                />
                <br/>
                </div>
                :
                <div>
                <p></p>
                <ButtonRed
                    textButton='Modifier le profil'
                    clickButton={this.bouttonModifierProfil}
                />
                </div>
                }
            </div>
        )
    }
}

export default ProfilUsager
