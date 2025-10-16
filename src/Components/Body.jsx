import '../App.css'
import poster1 from '../assets/poster1.png'
import video1 from '../assets/video1.mp4'
import poster2 from '../assets/poster2.png'

const Body = () => {
    return(
        <div className='media-gallery' >
            <img className="poster_2" src={poster2} alt="Poster_2" />
            <img className="poster_1" src={poster1} alt="Poster_1" />
            <video className='video_1' src={video1} autoPlay muted loop> Your browser does not support the video tag.</video>
        </div>
    )

}

export default Body;