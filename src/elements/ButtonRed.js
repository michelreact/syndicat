import React, { Component } from 'react'
import './ButtonRed.css'

class ButtonRed extends Component {

    // lors du click sur le boutton
    handleClick = () => {
        // envoyer en props une methode au component parent
        this.props.clickButton()
    }

    render () {
        // recuperation des props du component parent
        const { textButton } = this.props
        return(
            <div className='div-button-rouge'>
                { /* mise en place du button */ }
                <button 
                    className='button-rouge'
                    // relier une methode au click
                    onClick={this.handleClick}
                    // afficher le text via une props du component parent
                    >{textButton}
                </button>
            </div>
        )
    }
}

export default ButtonRed
