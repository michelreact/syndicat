import React, { Component } from 'react'
import './Infos.css'
// firebase
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'
import InputText from '../elements/InputText'
import Textarea from '../elements/Textarea'

class InfoForm extends Component {
    state = {
        // base infos
        infos: '',
        infoTitre: '',
        infoTextarea: '',
        infoId: '',
        // redirection
        redirectionInfos: false,
        // montage
        montage: false,
    }

    componentDidMount () {
        // connecter base infos
        this.ref = base.syncState(syndicat+'/infos',{
            context: this,
            state: 'infos'
        })

        const infoTitre = this.props.location.state.titre
        const infoTextarea = this.props.location.state.text
        const infoId = this.props.location.state.id
        this.setState({infoTitre, infoTextarea, infoId, montage:true })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionInfos: true })
    }

    // titre info
    recuperationInputTitreInfo = e => {
        this.setState({ infoTitre: e })
    }

    // textarea info
    recuperationTextareaInfo = e => {
        this.setState({ infoTextarea: e })
    }

    // sauvegarder info
    bouttonSauvegarderInfo = () => {
        const infos = {...this.state.infos}
        const {infoTitre, infoTextarea, infoId} = this.state
        let id = null
        if (infoTitre && infoTextarea) {
            if (infoId) {
                id = infoId
            } else {
                id = Date.now()
            }
            infos[id] = { infoTitre: infoTitre, infoTextarea: infoTextarea, infoId: id }
            this.setState({infos, redirectionInfos:true})
        }else {
            alert('Tous les champs ne sont pas remplis !')
        }
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render() {
        const { infoTitre, infoTextarea, redirectionInfos, montage } = this.state
        // redirection
        if (redirectionInfos) {
            return <Redirect push to={`/infos`} />
        }
        return (
            <div className='div-main'>
                <br/>
                <ButtonRed
                    textButton='retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='title'>Infos pratiques</p>
                <p className='text'>Titre</p>
                {montage?
                <InputText
                    sauvegarde={infoTitre}
                    recuperationInputText={this.recuperationInputTitreInfo}
                />
                :null}
                <p className='text'>Text</p>
                {montage?
                <Textarea
                    height={350}
                    recuperationTextarea={this.recuperationTextareaInfo}
                    sauvegarde={infoTextarea}
                />
                :null}
                <br/>
                <ButtonRed
                    textButton='Sauvegarder'
                    clickButton={this.bouttonSauvegarderInfo}
                />
                <br/>
            </div>
        )
    }
}

export default InfoForm

