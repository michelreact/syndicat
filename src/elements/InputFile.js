import React, { Component } from 'react'
import './InputFile.css'
import { storage } from '../base/base'
import syndicat from '../syndicat/Syndicat'

class InputFile extends Component {
    // state component
    state = {
        // si fichier
        siFichier: false,
        // en cours de chargement
        siChargement: false,
        // nom du fichier avec la date
        nameFile: '',
    }

    componentDidMount () {
        if (this.props.sauvegarde) {
            const nameFile = this.props.sauvegarde
            this.setState({nameFile, siFichier:true})
        }
    }

    onChangeFileHandle = e => {
        // recuperation du file
        const file = e.target.files[0]
        // ajout de la date au nom du fichier
        const nameFile = file.name + Date.now()
        // envoi du file sur le storage de firebase
        const uploadFile = storage.ref(`${syndicat}/${nameFile}`).put(file)
        // lors de l'envoi
        uploadFile.on('state_changed',
            (snapshot) => {
                // progress afficher en cours de chargement
                this.setState({siChargement: true, nameFile})
            },
            // si erreur
            (error) => {
                // error afficher les erreurs dans un log
                console.log('affichage des erreurs : ' + error)
            },
            // chargement OK
            () => {
                // si chargement
                // envoi du nom du file au component parent
                this.props.recuperationInputFile(nameFile)
                // mise a jour des const du state
                this.setState({ siChargement:false, siFichier:true, nameFile })
            }
        )
    }

    // supprimer un fichier
    onClickHandle = () => {
        const { nameFile } = this.state
        // suppression fichier storage
        storage.ref(`${syndicat}/${nameFile}`).delete()
        // mise a jour du state
        this.setState({ siFichier: false, nameFile: '' })
        // props supprimer fichier provisoire
        this.props.supprimerFichierProvisoire(this.state.nameFile)
    }

    render () {
        // recuperer les const du state
        const { siFichier, siChargement, nameFile } = this.state
        // en cours de chargement
        if (siChargement) {
            // afficher en cours de chargemennt
            return <p className='text-input-file'>En cours de chargement</p>
        }
        // si fichier
        if (siFichier) {
            // afficher boutton supprimer
            return(
                <div className='div-input-file-button-supprimer'>
                    <button
                        type='button'
                        onClick={this.onClickHandle}
                    >Supprimer : {nameFile}</button>
                    <br/>
                </div>
            ) 
        }
        
        return(
            // afficher input file
            <div className='div-input-file'>
                <input
                    // type file
                     type='file'
                    // appel methode lors d'un changement
                    onChange={this.onChangeFileHandle}
                />
            </div>
        )
    }
}

export default InputFile
