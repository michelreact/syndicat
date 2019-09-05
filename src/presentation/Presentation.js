import React, { Component } from 'react'
import './Presentation.css'
import imgpresentation from '../images/homepage.jpg'

class Presentation extends Component {
    render() {
        return(
            <div className='div-main'>
                <br/> 
                <h1 className='text-cgt-accueil'>LA CGT EN APPLI</h1>
                <h3 className='text-accueil'>Toi aussi demande ton application</h3> 
                <a href="mailto:syndicatfrance@gmail.com"><h3 className='text-accueil'>syndicatfrance@gmail.com</h3></a>
                <img src={imgpresentation} alt="imgpresentation" className='img-presentation' />
            </div>
        )
    }
}

export default Presentation
