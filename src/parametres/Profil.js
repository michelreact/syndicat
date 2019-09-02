import React, { Component } from 'react'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
import InputText from '../elements/InputText'
import ButtonRed from '../elements/ButtonRed'
import Textarea from '../elements/Textarea'

class Profil extends Component {
    state = {
        // base usagers
        usagers: '',
        // redirection
        redirectionHome: false,
        // data usager
        id: '',
        prenom: '',
        nom: '',
        telephone: '',
        mail: '',
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
                // recuperation du id
                this.setState({ id: user.uid })          
            }
        })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionHome: true })
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

    // boutton sauvegarder
    bouttonSauvegarder = () => {
        const usagers = { ...this.state.usagers }
        const { id, prenom, nom, telephone, adresse } = this.state
        console.log('profil'+ id)
        if (prenom !== '') {usagers[id] = {prenom: prenom}}
        if (nom !== '') {usagers[id] = {nom: nom.toUpperCase()}}
        if (telephone !== '') {usagers[id] = {telephone: telephone}}
        if (adresse !== '') {usagers[id] = {adresse: adresse}}
        this.setState({ usagers, redirectionHome: true })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render() {
        const { id, usagers, redirectionHome } = this.state
        // redirection 
        if (redirectionHome) {
            return <Redirect push to={`/parametres`}/>
        }
        // recuperation du profil
        let recuperationPrenom = null
        let recuperationNom = null
        let recuperationTelephone = null
        let recuperationMail = null
        let recuperationAdresse = null
        if (usagers) {
            recuperationPrenom = Object.keys(usagers).filter(key => key === id).map(key => 
                <InputText key={key}
                sauvegarde={usagers[key].prenom}
                recuperationInputText={this.recuperationInputPrenom}/>)
            recuperationNom = Object.keys(usagers).filter(key => key === id).map(key => 
                <InputText key={key}
                sauvegarde={usagers[key].nom}
                recuperationInputText={this.recuperationInputNom}/>)
            recuperationTelephone = Object.keys(usagers).filter(key => key === id).map(key => 
                <InputText key={key}
                sauvegarde={usagers[key].telephone}
                recuperationInputText={this.recuperationInputTelephone}/>)
            recuperationMail = Object.keys(usagers).filter(key => key === id).map(key => 
                <p className='text'>{usagers[key].mail}</p>)
            recuperationAdresse = Object.keys(usagers).filter(key => key === id).map(key => 
                <Textarea key={key}
                    height={80}
                    recuperationTextarea={this.recuperationInputAdresse}
                    sauvegarde={usagers[key].adresse}
                />)
        }
        return(
            <div className='div-main'>
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='title'>Page profil</p>
                <p className='text'>Prenom</p> 
                {recuperationPrenom}
                <p className='text'>Nom</p> 
                {recuperationNom}
                <p className='text'>Telephone</p> 
                {recuperationTelephone}
                <p className='text'>Email</p> 
                {recuperationMail}
                <p className='text'>Adresse</p> 
                {recuperationAdresse}
                <br/>
                <ButtonRed
                    textButton='Sauvegarder'
                    clickButton={this.bouttonSauvegarder}
                />
                <br/>
            </div>
        )
    }
}

export default Profil
