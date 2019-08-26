import React, { Component } from 'react'
import './InfoSingle.css'
// elements
import ButtonRed from '../elements/ButtonRed'
// redirect
import { Redirect } from 'react-router-dom'

class InfoSingle extends Component {
    state = {
        redirectionInfos: ''
    }

    // boutton retour
    bouttonRetour = () => {
        this.setState({ redirectionInfos:true })
    }

    render() {
        const { redirectionInfos } = this.state
        // redirection
        if (redirectionInfos) {
            // redirect
            return <Redirect push to={`/infos`} />
        }
        return(
            <div className='div-main'>
                <br/>
                <ButtonRed
                    textButton='Retour'
                    clickButton={this.bouttonRetour}
                />
                {/* titre info */}
                <div className='info-single-div-titre-info'>
                    <p className='info-single-titre'>{this.props.location.state.titre}</p>
                </div>
                {/* textarea info */}
                <div className='info-single-div-textarea-info'>
                    <p className='info-single-textarea'>{this.props.location.state.text}</p>
                </div>
            </div>
        )
    }
}

export default InfoSingle
