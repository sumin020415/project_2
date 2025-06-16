import homeStyle from './home.module.css'
import KakaoMap from '../hooks/KakaoMapLoad'
import { useEffect } from 'react'

const Home = () => {
    return(
        <section id="home" data-page="home">
            <KakaoMap className={homeStyle.map}></KakaoMap>
        </section>
    )
}

export default Home