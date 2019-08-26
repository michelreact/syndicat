import React, { Component } from 'react'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'
import ButtonYellow from '../elements/ButtonYellow'

class Infos extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // base infos
        infos: '',
        infoTitre: '',
        infoTextarea: '',
        infoId: '',
        // redirection
        redirectionHome: false,
        redirectionInfoForm: false,
        redirectionSingleInfo: false,
    }

    componentDidMount () {
        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base infos
        this.ref2 = base.syncState(syndicat+'/infos',{
            context: this,
            state: 'infos'
        })

        // Si Authentifier
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ usagerId: user.uid, redirectionHome:false })
            } else {
              this.setState({ redirectionHome:true })
            }
        })
    }

    // ajouter info
    bouttonAjouterInfo = () => {
        this.setState({ redirectionInfoForm:true })
    }

    // click sur un element de la liste
    clickListeInfo = (titre, textarea) => {
        const infoTitre = titre
        const infoTextarea = textarea
        this.setState({ infoTitre, infoTextarea, redirectionSingleInfo:true })
    }

    // modifier info
    bouttonModifierInfo = (titre, text, id) => {
        const infoTitre = titre
        const infoTextarea = text
        const infoId = id
        this.setState({infoTitre, infoTextarea, infoId, redirectionInfoForm:true})
    }

    // supprimer info
    bouttonSupprimerInfo = id => {
        const infos = {...this.state.infos}
        infos[id] = null
        this.setState({ infos })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render () {
        const { redirectionHome, usagers, usagerId, redirectionSingleInfo,
            infos, infoTitre, infoTextarea, infoId, redirectionInfoForm } = this.state
        // redirection
        if (redirectionHome) {
            return <Redirect push to={`/`} />
        }
        // redirection info form
        if (redirectionInfoForm) {
            return <Redirect push to={{
                        pathname: `/infos/infoForm`,
                        state: {
                            titre: infoTitre,
                            text: infoTextarea,
                            id: infoId
                        }
                    }} />
                }
        // direction info single
        if (redirectionSingleInfo) {
            return <Redirect push to={{
                        pathname: `/infos/infoSingle`,
                        state: {
                            titre: infoTitre,
                            text: infoTextarea
                        }
                    }} />
        }
        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <p className='title'>Vous devez être adherent pour consulter cette page.</p>
        }
        // si admin
        let admin = false
        let buttonAddInfo = null
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
            buttonAddInfo = (
                <ButtonRed
                    textButton='Ajouter une info'
                    clickButton={this.bouttonAjouterInfo}
                />)
        }
        // en cours de chargement
        if (!infos) {
            return <p className='title'>En cours de chargement</p>
        }
        // infos liste
        let liste = Object.keys(infos).reverse().map(key =>
            <div key={key} className='infos-div-flex'>
                <div className='infos-div-column-text'
                     onClick={() => this.clickListeInfo(infos[key].infoTitre, infos[key].infoTextarea)}>
                    <p>{infos[key].infoTitre}</p>
                </div>
                <div className='infos-div-column-button'>
                    {admin?
                    <ButtonYellow
                        textButton='Modifier'
                        clickButton={() => this.bouttonModifierInfo(
                            infos[key].infoTitre,
                            infos[key].infoTextarea,
                            key
                        )}
                    />
                    :null}
                </div>
                <div className='infos-div-column-button'>
                    {admin?
                    <ButtonRed
                        textButton='Supprimer'
                        clickButton={() => this.bouttonSupprimerInfo(key)}
                    />
                    :null}
                </div>
            </div>
            )
        return(
            <div className='div-main'>
                <p className='title'>Infos pratiques</p>
                {buttonAddInfo}
                {liste}
            </div>
        )
    }
}

export default Infos
