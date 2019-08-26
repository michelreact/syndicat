import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import './Accueil.css'
import NotFound from '../notFound/NotFound'
import Presentation from '../presentation/Presentation'
import logo from '../images/lacgt.png'
import PageAuth from '../authentification/PageAuth'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import Parametres from '../parametres/Parametres'
import Profil from '../parametres/Profil'
import Tracts from '../tracts/Tracts'
import TractForm from '../tracts/TractForm'
import Infos from '../infos/Infos'
import InfoForm from '../infos/InfoForm'
import InfoSingle from '../infos/InfoSingle'
import Equipe from '../equipe/Equipe'
import EquipeForm from '../equipe/EquipeForm'
import Forum from '../forum/Forum'
import ForumForm from '../forum/ForumForm'
import ForumSingle from '../forum/ForumSingle'
import ListeUsagers from '../parametres/ListeUsagers'
import ProfilUsager from '../parametres/ProfilUsager'
import Notification from '../parametres/Notification'


class Accueil extends Component {
    state = {
        // connexion deconnexion
        ouiConnexion: false,
    }

    // si connecté ?
    componentDidMount () {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              console.log('oui connexion')
              this.setState({ ouiConnexion:true })
            } else {
                console.log('non connexion')
                this.setState({ ouiConnexion:false })
            }
        })
    }

    // boutton deconnexion
    bouttonDeconnexion = () => {
        firebase.auth().signOut()
    }

    render () {
        const { ouiConnexion } = this.state
        return(
            <BrowserRouter>
            <div>
            { /* mise en place du haut de page avec le logo cgt */ }
            <div className='header'>
              <div className='header-flex'>
                <div className='header-logo'>
                  <img src={logo} alt="Logo" className='logo-cgt' /> 
                </div> 
              </div>
            </div>
            { /* mise en place du menu */ }              
            <nav>
                <ul>
                    <li><Link to={'/'} className="nav-link">Home</Link></li>
                    <li><Link to={'/tracts'} className="nav-link">Tracts</Link></li>
                    <li><Link to={'/infos'} className="nav-link">Infos</Link></li>
                    <li><Link to={'/forum'} className="nav-link">Forum</Link></li>
                    <li><Link to={'/equipe'} className="nav-link">Equipe</Link></li>
                    <li><Link to={'/parametres'} className="nav-link">Param</Link></li>
                    {ouiConnexion?
                    <li className="accueil-boutton-deconnexion" 
                        onClick={this.bouttonDeconnexion}>
                          <Link to={'/'} className="nav-link">Deconnexion</Link></li>
                    :
                    <li><Link to={'/pageAuth'} className="nav-link">Connexion</Link></li>
                    }
                </ul>
            </nav>
            { /* mise en place des routes */ }
              <Switch>
                <Route exact path='/' component={Presentation} />
                <Route exact path='/pageAuth' component={PageAuth} /> 
                <Route exact path='/parametres' component={Parametres} />  
                <Route exact path='/profil' component={Profil} />
                <Route exact path='/tracts' component={Tracts} />
                <Route exact path='/tracts/tractForm' component={TractForm} />
                <Route exact path='/infos' component={Infos} />
                <Route exact path='/infos/infoForm' component={InfoForm} />
                <Route exact path='/infos/infoSingle' component={InfoSingle} />
                <Route exact path='/equipe' component={Equipe} />
                <Route exact path='/equipe/equipeForm' component={EquipeForm} />
                <Route exact path='/forum' component={Forum} />
                <Route exact path='/forum/form' component={ForumForm} />
                <Route exact path='/forum/single' component={ForumSingle} />
                <Route exact path='/listeUsagers' component={ListeUsagers} />
                <Route exact path='/profilUsager' component={ProfilUsager} />
                <Route exact path='/notification' component={Notification} />
                <Route component={NotFound} />             
              </Switch>
            </div>
          </BrowserRouter>
        )
    }
}

export default Accueil

