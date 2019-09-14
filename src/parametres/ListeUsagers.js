import React, { Component } from 'react'
import './ListUsagers.css'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import base from '../base/base'
// redirection
import { Redirect } from 'react-router-dom'
import syndicat from '../syndicat/Syndicat'
// elements
import ButtonRed from '../elements/ButtonRed'

class ListeUsagers extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // usagers classé
        newState: '',
        // checked
        checkAdmin: true,
        checkElu: true,
        checkAdherent: true,
        // redirection
        redirectionProfil: false,
        redirectionParam: false,
        // 
        selectId: '',
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

        // classement afphabetique des usagers
        const recup = firebase.database().ref('web3/usagers').orderByChild('nom')
        recup.on('value', snapshot => {
            let newState = []
            snapshot.forEach(childSnapshot =>{
                var childData = childSnapshot.val()
                newState.push({
                    nom: childData.nom,
                    id: childData.id
                })        
            }) 
            this.setState({ newState })                     
        })
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionParam: true })
    }

    // turn adherent false
    turnAdherentFalse = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].adherent = false
        this.setState({ usagers })
    }

    // turn adherent true
    turnAdherentTrue = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].adherent = true
        this.setState({ usagers })
    }

    // turn elu false
    turnEluFalse = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].elu = false
        this.setState({ usagers })
    }

    // turn elu true
    turnEluTrue = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].elu = true
        this.setState({ usagers })
    }

    // turn admin false
    turnAdminFalse = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].admin = false
        this.setState({ usagers })
    }

    // turn admin true
    turnAdminTrue = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].admin = true
        this.setState({ usagers })
    }

    // selection d'un usager dans la liste
    selectionUsager = id => {
        this.setState({ redirectionProfil:true, selectId: id })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render() {
        const { 
            // usagers
            usagers, 
            usagerId,
            // usagers classé
            newState,
            // redirection
            redirectionProfil,
            redirectionParam,
            // props 
            selectId,
        } = this.state

        // en cours de chargement
        if (usagers){}else{
            return <p className='title'>En cours de chargement</p>
        }

        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }else {return <p className='title'>Vous devez être administrateur pour accéder à cette page</p>}

        // redirection profil
        if (redirectionProfil) {
            return <Redirect push to={{
                pathname: `/profilUsager`,
                state: {
                    selectId: selectId
                }
            }} />
        }

        // redirection Param
        if (redirectionParam) {
            return <Redirect push to ={`/parametres`} />
        }

        // liste usagers
        const list = Object.keys(newState).map(key =>
            <div key={key} className='list-usagers-div-flex'>
                <div className='list-usagers-div-nom' onClick={() => this.selectionUsager(newState[key].id)}>
                    <p>{newState[key].nom} {usagers[newState[key].id].prenom}</p>
                </div>
                {usagers[newState[key].id].officiel? 
                <div className='list-usagers-div-checkbox'>
                    <p>compte administrateur</p>
                </div>
                :
                <div className='list-usagers-div-checkbox'>
                    <div className='list-usagers-div-items'>
                    adh
                    </div>
                    <div className='list-usagers-div-items'>
                    {usagers[newState[key].id].adherent?
                    <input 
                        type='checkbox' 
                        className='list-usagers-checkbox'
                        onChange={() => this.turnAdherentFalse(newState[key].id)}
                        defaultChecked={this.state.checkAdherent}
                    />
                    :
                    <input 
                        type='checkbox' 
                        className='list-usagers-checkbox'
                        onChange={() => this.turnAdherentTrue(newState[key].id)}
                        defaultChecked={!this.state.checkAdherent}
                    />
                    }
                    </div>
                    <div className='list-usagers-div-items'>
                    elu
                    </div>
                    <div className='list-usagers-div-items'>
                    {usagers[newState[key].id].elu?
                    <input 
                        type='checkbox' 
                        className='list-usagers-checkbox'
                        onChange={() => this.turnEluFalse(newState[key].id)}
                        defaultChecked={this.state.checkElu}
                    />
                    :
                    <input 
                        type='checkbox' 
                        className='list-usagers-checkbox'
                        onChange={() => this.turnEluTrue(newState[key].id)}
                        defaultChecked={!this.state.checkElu}
                    />
                    }
                    </div>
                    <div className='list-usagers-div-items'>
                    adm
                    </div>
                    <div className='list-usagers-div-items'>
                    {usagers[newState[key].id].admin?
                    <input 
                        type='checkbox' 
                        className='list-usagers-checkbox'
                        onChange={() => this.turnAdminFalse(newState[key].id)}
                        defaultChecked={this.state.checkAdmin}
                    />
                    :
                    <input 
                        type='checkbox' 
                        className='list-usagers-checkbox'
                        onChange={() => this.turnAdminTrue(newState[key].id)}
                        defaultChecked={!this.state.checkAdmin}
                    />
                    }
                    </div>
                </div>
                }
            </div>
            )

        return(
            <div className='div-main'>
                <p></p>
                <ButtonRed 
                    textButton='Retour'
                    clickButton={this.bouttonRetour}
                />
                <p className='title'>Liste des usagers</p>
                {list}
            </div>
        )
    }
}

export default ListeUsagers

