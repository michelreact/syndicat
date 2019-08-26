import React, { Component } from 'react'
import './EquipeForm.css'
// firebase
import { storage } from '../base/base'
import 'firebase/auth'
import base from '../base/base'
import syndicat from '../syndicat/Syndicat'
// elements
import InputFile from '../elements/InputFile'
import InputText from '../elements/InputText'
import Textarea from '../elements/Textarea'
import ButtonRed from '../elements/ButtonRed'
// redirect
import { Redirect } from 'react-router-dom'


class EquipeForm extends Component {
    state = {
        // base equipe
        equipes: '',
        nomEquipier: '',
        fonctionEquipier: '',
        photoEquipier: '',
        idEquipier: '',
        url: '',
        // redirection 
        redirectionEquipes: false,
        // montage
        montage: false,
    }

    // connection base
    componentDidMount () {
        // base equipes
        this.ref = base.syncState(syndicat+'/equipes',{
            context: this,
            state: 'equipes'
        })

        // recuperation photo
        const idEquipier = this.props.location.state.id
        const nomEquipier = this.props.location.state.nom
        const fonctionEquipier = this.props.location.state.fonction
        const photoEquipier = this.props.location.state.photo
        const url = this.props.location.state.url
        this.setState({ montage: true, idEquipier, nomEquipier, fonctionEquipier, photoEquipier, url })
    }

    // photo nom et url
    recuperationInputFile = e => {
        const photoEquipier = e
        storage.ref(syndicat).child(e).getDownloadURL().then(url => {
            this.setState({ url })})
        this.setState({ photoEquipier })  
    }

    // image provisoire
    supprimerFichierProvisoire = () => {
        this.setState({ url: '' })
    }

    // nom equipier
    recuperationInputNom = e => {
        this.setState({ nomEquipier: e })
    }

    // fonction equipier
    recuperationTextareaEquipe = e => {
        this.setState({ fonctionEquipier: e })
    }

    // sauvegarder
    bouttonSauvegarder = () => {
        const equipes = {...this.state.equipes}
        const { nomEquipier, fonctionEquipier, photoEquipier, idEquipier, url } = this.state
        let id = null
        if (nomEquipier && fonctionEquipier) {
            if (idEquipier) {
                id = idEquipier
            }else {
                id = Date.now()
            }
            equipes[id] = { nom: nomEquipier,fonction: fonctionEquipier, photo: photoEquipier, url: url }
            this.setState({ equipes, redirectionEquipes:true })
        }else {
            alert('Tous les champs de sont pas remplis')
        }        
    }

    // deconnecter base equipes
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render() {
        const { url, redirectionEquipes, montage, nomEquipier, fonctionEquipier,
                photoEquipier } = this.state
        // photo
        let $photo = null
        if (url) {
            $photo = (
                <img className='img-equipier' alt='equipier' src={url}/>
            )
        }   
        // redirection
        if (redirectionEquipes) {
            return <Redirect push to={`/equipe`} />
        }
        return(
            <div className='div-main'>
                <p className='title'>Equipe</p>
                <div className='equipe-form-div-flex'>
                    <div className='equipe-form-div-column'>
                        <p className='text'>Photo</p>
                        {montage?
                        <InputFile
                            recuperationInputFile={this.recuperationInputFile}
                            sauvegarde={photoEquipier}
                            supprimerFichierProvisoire={this.supprimerFichierProvisoire}                          
                        />
                        :null}
                        <div className='equipe-form-cadre'>
                            {$photo}
                        </div>
                    </div>
                    <div className='equipe-form-div-column'>
                        <p className='text'>Nom</p>
                        {montage?
                        <InputText
                            recuperationInputText={this.recuperationInputNom}
                            sauvegarde={nomEquipier}                           
                        />
                        :null}
                        <p className='text'>Fonction</p>
                        {montage?
                        <Textarea
                            height={100}
                            recuperationTextarea={this.recuperationTextareaEquipe}
                            sauvegarde={fonctionEquipier}                            
                        />
                        :null}
                        <br/>
                        <ButtonRed
                            textButton='Sauvegarder'
                            clickButton={this.bouttonSauvegarder}
                        />
                    </div>            
                </div>
            </div>
        )
    }
}

export default EquipeForm
