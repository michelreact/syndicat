import React, { Component } from 'react'
// firebase
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'
import InputText from '../elements/InputText'
import InputFile from '../elements/InputFile'

class TractForm extends Component {
    state = {
        // base
        tracts: '',
        tractTitre: '',
        tractFichier: '',
        tractId: '',
        // redirection
        redirectionTracts: false,
        // montage
        montage: false,
    }

    // connecter base tracts
    componentDidMount () {
        this.ref = base.syncState(syndicat+'/tracts',{
            context: this,
            state: 'tracts'
        })
    
        // recuperation des props
        const tractTitre = this.props.location.state.titre
        const tractFichier = this.props.location.state.fichier
        const tractId = this.props.location.state.id
        this.setState({ tractTitre, tractFichier, tractId, montage:true })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionTracts: true })
    }

    // titre tract
    recuperationInputTitreTract = e => {
        this.setState({ tractTitre: e })
    }

    // fichier input
    recuperationInputFile = e => {
        this.setState({ tractFichier: e })
    }

    // sauvegarder
    bouttonSauvegarder = () => {
        const tracts = {...this.state.tracts}
        const {tractTitre, tractFichier, tractId} = this.state
        let id = null
        if (tractTitre && tractFichier) {
            if (tractId) {
                id = tractId
            }else {
                id = Date.now()
            }
            tracts[id] = {titre: tractTitre, fichier: tractFichier}
            this.setState({tracts, redirectionTracts:true})
        }else {
            alert('tous les champs doivent êtres remplis')
        }
    }

    // deconnecter base tracts
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render() {
        const { redirectionTracts, tractTitre, tractFichier, montage } = this.state
        // redirection
        if (redirectionTracts) {
            return <Redirect push to={`/tracts`} />
        }
        return(
            <div className='div-main'>
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='title'>Tracts</p>
                <p className='text'>Titre du tract</p>
                {montage?
                <InputText
                    recuperationInputText={this.recuperationInputTitreTract}
                    sauvegarde={tractTitre}
                />
                :null}
                <p className='text'>Fichier</p>
                {montage?
                <InputFile
                    recuperationInputFile={this.recuperationInputFile}
                    sauvegarde={tractFichier}
                    supprimerFichierProvisoire={this.supprimerFichierProvisoire}
                />
                :null}
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

export default TractForm
